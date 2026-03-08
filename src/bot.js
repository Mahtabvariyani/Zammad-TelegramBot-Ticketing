import { Bot } from "grammy";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const ZAMMAD_URL = process.env.ZAMMAD_URL;
const ZAMMAD_TOKEN = process.env.ZAMMAD_TOKEN;
const ZAMMAD_GROUP = process.env.ZAMMAD_GROUP || "1st Level Support";

if (!TELEGRAM_TOKEN) throw new Error("Missing TELEGRAM_TOKEN in .env");
if (!ZAMMAD_URL) throw new Error("Missing ZAMMAD_URL in .env");
if (!ZAMMAD_TOKEN) throw new Error("Missing ZAMMAD_TOKEN in .env");

const bot = new Bot(TELEGRAM_TOKEN);

// Conversation states in memory
const sessions = new Map();

const questions = [{
        key: "fehlerbild",
        text: "1. Fehlerbild\n\n" +
            "Beschreibe nur, was passiert. Keine Vermutung.\n\n" +
            "Bitte immer in dieser Reihenfolge antworten:\n" +
            "- Was passiert?\n" +
            "- Wann passiert es?\n" +
            "- Wie oft passiert es?\n" +
            "- Wer ist betroffen?\n\n" +
            "Beispiel:\n" +
            "Outlook startet normal.\n" +
            "Nach der Anmeldung erscheint „Keine Rückmeldung“.\n" +
            "Das Problem tritt seit heute Morgen auf.\n" +
            "Betroffen ist ein Benutzer im Vertrieb."
    },
    {
        key: "umgebung",
        text: "2. Umgebung\n\n" +
            "Bitte antworte mit diesen Details:\n" +
            "- Windows Version\n" +
            "- Programm und Version\n" +
            "- VPN: an oder aus\n" +
            "- Netzwerk: WLAN, LAN oder VPN"
    },
    {
        key: "bereitsGetestet",
        text: "3. Bereits getestet\n\n" +
            "Liste alle Schritte auf, die du bereits durchgeführt hast, mit Ergebnis.\n\n" +
            "Wichtig:\n" +
            "- Immer als Liste\n" +
            "- Nicht als Fließtext\n\n" +
            "Beispiel:\n" +
            "- PC neu gestartet\n" +
            "- Internet geprüft\n" +
            "- Add-Ins deaktiviert\n" +
            "- Problem weiterhin vorhanden"
    },
    {
        key: "beobachtung",
        text: "4. Beobachtung und Analyse\n\n" +
            "Schreibe Hinweise aus Tools. Optional auch eine vorsichtige Vermutung.\n\n" +
            "Beispiel:\n" +
            "Keine Auffälligkeiten im Task Manager.\n" +
            "Vermutung: Profil- oder Add-In-Problem.\n\n" +
            "Wichtig: Vermutung klar als Vermutung kennzeichnen."
    },
    {
        key: "anhaenge",
        text: "5. Anhänge\n\n" +
            "Gibt es Anhänge?\n" +
            "- Screenshots\n" +
            "- Logs\n" +
            "- Dateien\n\n" +
            "Wenn keine Anhänge vorhanden sind, schreibe einfach:\n" +
            "Keine Anhänge"
    },
    {
        key: "naechsterSchritt",
        text: "6. Nächster Schritt oder Eskalation\n\n" +
            "Schreibe, was als nächstes passieren soll und an wen es geht.\n\n" +
            "Immer mit Begründung.\n\n" +
            "Beispiel:\n" +
            "Standardmaßnahmen ohne Erfolg. Übergabe an 2nd Level zur weiteren Analyse."
    }
];

function startSupportSession(chatId) {
    sessions.set(chatId, {
        step: 0,
        answers: {}
    });
}

function getSession(chatId) {
    return sessions.get(chatId);
}

function endSession(chatId) {
    sessions.delete(chatId);
}

function buildTicketBody(ctx, answers) {
    const username = ctx.from && ctx.from.username ? "@" + ctx.from.username : "unknown";
    const firstName = ctx.from && ctx.from.first_name ? ctx.from.first_name : "Telegram";
    const lastName = ctx.from && ctx.from.last_name ? ctx.from.last_name : "User";
    const chatId = ctx.chat.id;

    return (
        "Telegram Support Intake\n\n" +
        "Kundendaten:\n" +
        "Telegram First Name: " + firstName + "\n" +
        "Telegram Last Name: " + lastName + "\n" +
        "Telegram Username: " + username + "\n" +
        "Telegram ID: " + chatId + "\n\n" +

        "1. Fehlerbild\n" +
        answers.fehlerbild + "\n\n" +

        "2. Umgebung\n" +
        answers.umgebung + "\n\n" +

        "3. Bereits getestet\n" +
        answers.bereitsGetestet + "\n\n" +

        "4. Beobachtung und Analyse\n" +
        answers.beobachtung + "\n\n" +

        "5. Anhänge\n" +
        answers.anhaenge + "\n\n" +

        "6. Nächster Schritt oder Eskalation\n" +
        answers.naechsterSchritt
    );
}

function buildTicketTitle(answers) {
    const firstLine = answers.fehlerbild ?
        answers.fehlerbild.split("\n")[0].trim() :
        "Telegram Support Request";

    if (!firstLine) return "Telegram Support Request";

    return "Telegram: " + firstLine.slice(0, 80);
}

bot.command("start", async(ctx) => {
    await ctx.reply(
        "Willkommen.\n" +
        "Benutze /support, um ein Support-Ticket zu erstellen.\n" +
        "Benutze /cancel, um den Vorgang abzubrechen."
    );
});

bot.command("support", async(ctx) => {
    startSupportSession(ctx.chat.id);
    await ctx.reply(
        "Wir erstellen jetzt gemeinsam ein strukturiertes Support-Ticket.\n\n" +
        questions[0].text
    );
});

bot.command("cancel", async(ctx) => {
    endSession(ctx.chat.id);
    await ctx.reply("Der Support-Vorgang wurde abgebrochen.");
});

bot.on("message:text", async(ctx) => {
    const text = ctx.message && ctx.message.text ? ctx.message.text.trim() : "";

    if (!text) return;
    if (text.startsWith("/")) return;

    const session = getSession(ctx.chat.id);
    if (!session) return;

    const currentQuestion = questions[session.step];
    session.answers[currentQuestion.key] = text;
    session.step += 1;

    if (session.step < questions.length) {
        await ctx.reply(questions[session.step].text);
        return;
    }

    const generatedEmail = "telegram_" + ctx.chat.id + "@support.local";
    const ticketBody = buildTicketBody(ctx, session.answers);
    const ticketTitle = buildTicketTitle(session.answers);

    try {
        const response = await axios.post(
            ZAMMAD_URL + "/api/v1/tickets", {
                title: ticketTitle,
                group: ZAMMAD_GROUP,
                customer_id: "guess:" + generatedEmail,
                article: {
                    subject: "Telegram Support Intake",
                    body: ticketBody,
                    type: "note",
                    internal: false
                }
            }, {
                headers: {
                    Authorization: "Token token=" + ZAMMAD_TOKEN,
                    "Content-Type": "application/json"
                }
            }
        );

        const ticketId = response.data && response.data.id ? response.data.id : "-";
        const ticketNumber = response.data && response.data.number ? response.data.number : "-";

        endSession(ctx.chat.id);

        await ctx.reply(
            "✅ Ticket wurde erfolgreich erstellt.\n" +
            "Ticket ID: " + ticketId + "\n" +
            "Ticket Nummer: " + ticketNumber
        );
    } catch (error) {
        let status = "unknown";
        let reason = "Unknown error";

        if (error.response) {
            if (error.response.status) status = error.response.status;

            if (error.response.headers && error.response.headers["x-failure"]) {
                reason = error.response.headers["x-failure"];
            } else if (error.response.data && error.response.data.error) {
                reason = error.response.data.error;
            } else if (typeof error.response.data === "string") {
                reason = error.response.data;
            }
        } else if (error.message) {
            reason = error.message;
        }

        console.error("Zammad error:", error.response ? error.response.data : error.message);

        await ctx.reply(
            "❌ Fehler beim Erstellen des Tickets.\n" +
            "Status: " + status + "\n" +
            "Grund: " + reason
        );
    }
});

bot.catch((err) => {
    console.error("Bot error:", err);
});

bot.start();
console.log("Bot is running...");