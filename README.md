<img width="1536" height="1024" alt="ChatGPT Image Mar 8, 2026, 05_26_46 PM" src="https://github.com/user-attachments/assets/4735dda0-2b39-402a-9f0a-e4899490c8a0" />

Here is a **more professional GitHub README** with **badges, architecture, sections, and developer style**. You can copy it directly as `README.md`.

---

```markdown
# Telegram → Zammad Ticket Bot

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue)
![Zammad](https://img.shields.io/badge/Zammad-API-red)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Experimental-orange)

A simple **Telegram Bot integration with Zammad** that allows users to create **support tickets directly from Telegram**.

Users send a message to the bot and a **ticket is automatically created in Zammad** using the **Zammad REST API**.

This project demonstrates **automation of support workflows** and integration between **chat platforms and helpdesk systems**.

---

# Architecture

```

Telegram User
│
▼
Telegram Bot (grammY)
│
▼
Node.js Backend
│
▼
Zammad REST API
│
▼
Zammad Ticket System

```

---

# Features

- Telegram bot commands
- Automatic ticket creation in Zammad
- Uses **Zammad REST API**
- Stores credentials securely using `.env`
- Works with **local or remote Zammad instances**
- Includes **Telegram user information inside tickets**

---

# Commands

| Command | Description |
|------|-------------|
| `/start` | Start the bot |
| `/support` | Create a support request |
| message | Creates a ticket |

Example:

```

/support
My VPN is not working

```

This will create a **new ticket in Zammad**.

---

# Project Structure

```

zammadtelegram/
│
├── src/
│   └── bot.js
│
├── .env
├── package.json
└── README.md

````

---

# Requirements

Before running the project, make sure you have:

- **Node.js 18+**
- **Telegram Bot Token**
- **Zammad Instance**
- **Zammad API Token**

---

# Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/zammadtelegram.git
````

Enter the project folder:

```bash
cd zammadtelegram
```

Install dependencies:

```bash
npm install
```

Dependencies used:

* **grammy** → Telegram bot framework
* **axios** → HTTP client for API requests
* **dotenv** → Environment variables

---

# Environment Variables (.env)

Create a `.env` file in the root directory.

Example:

```
TELEGRAM_TOKEN=your_telegram_bot_token
ZAMMAD_URL=http://localhost:8080
ZAMMAD_TOKEN=your_zammad_api_token
```

### TELEGRAM_TOKEN

Token received from **BotFather**

Example:

```
1234567890:AAExampleTelegramBotToken
```

---

### ZAMMAD_URL

URL of your Zammad instance.

Example for local installation:

```
http://localhost:8080
```

---

### ZAMMAD_TOKEN

Create this token in Zammad:

1. Open Zammad
2. Click **Profile**
3. Go to **Token Access**
4. Create a new API token
5. Copy it to `.env`

Example:

```
abc123examplezammadtoken
```

---

# Running the Bot

Start the bot:

```
node src/bot.js
```

If everything is correct you should see:

```
Telegram bot is running...
```

---

# Testing the Bot

Open Telegram and send:

```
/start
```

Then:

```
/support
```

Then send a problem:

```
My VPN is not working
```

A new **ticket will appear in Zammad**.

---

# Example Ticket Content

When a user sends a message, the ticket will contain:

```
Telegram Name: John
Telegram Username: @johnexample
Telegram ID: 123456789

Problem:
My VPN is not working
```

This allows support agents to identify the user.

---

# Common Errors

### 401 Unauthorized

Usually caused by:

* wrong Telegram token
* wrong Zammad API token

Check your `.env` file.

---

### Cannot find package 'grammy'

Install dependencies:

```
npm install grammy axios dotenv
```

---

### Cannot use import statement outside a module

Add this to `package.json`:

```json
"type": "module"
```

Example:

```json
{
  "name": "zammadtelegram",
  "version": "1.0.0",
  "type": "module"
}
```

---

# Future Improvements

Possible improvements:

* Ticket priority selection
* Category selection
* `/mytickets` command
* Ticket status notifications
* Reply to tickets from Telegram
* Map Telegram users to Zammad customers
* Webhook deployment

---

# Use Case

This project is useful for:

* IT Support teams
* DevOps environments
* Helpdesk automation
* Telegram community support

---

# Technologies Used

* **Node.js**
* **grammY**
* **Telegram Bot API**
* **Zammad REST API**
* **Axios**
* **dotenv**

