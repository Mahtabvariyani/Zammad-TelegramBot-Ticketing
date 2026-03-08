<img width="1536" height="1024" alt="ChatGPT Image Mar 8, 2026, 05_26_46 PM" src="https://github.com/user-attachments/assets/4735dda0-2b39-402a-9f0a-e4899490c8a0" />


````markdown
# Telegram → Zammad Ticket Bot

A simple Telegram bot that creates support tickets in **Zammad**.  
Users can send their problem through Telegram, and the bot forwards it to Zammad using the **Zammad API**.

---

## Overview

This project connects:

- **Telegram Bot**
- **Node.js**
- **grammY**
- **Zammad API**

Flow:

1. User opens the Telegram bot
2. User sends `/start`
3. User sends `/support`
4. User writes the problem
5. Bot sends the message to **Zammad**
6. A new ticket is created automatically

---

## Features

- `/start` command
- `/support` command
- Creates a ticket in Zammad
- Uses `.env` file for secure tokens
- Easy local testing with a local Zammad instance

---

## Project Structure

```text
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

## Requirements

Before starting, make sure you have:

* **Node.js** installed
* A **Telegram bot token** from **@BotFather**
* A running **Zammad instance**
* A **Zammad API token**

---

## Installation

Clone or create the project folder, then install the packages:

```bash
npm init -y
npm install grammy axios dotenv
```

---

## What should be inside the `.env` file?

Create a file named:

```text
.env
```

Put this inside:

```env
TELEGRAM_TOKEN=your_telegram_bot_token_here
ZAMMAD_URL=http://localhost:8080
ZAMMAD_TOKEN=your_zammad_api_token_here
```

### Explanation

* `TELEGRAM_TOKEN`
  The token you get from **BotFather**

* `ZAMMAD_URL`
  The URL of your Zammad instance
  Example for local setup:

  ```env
  ZAMMAD_URL=http://localhost:8080
  ```

* `ZAMMAD_TOKEN`
  The API token created inside Zammad

---

## How to create the Zammad API token

In Zammad:

1. Open your Zammad instance in the browser
2. Click your **profile/avatar**
3. Go to **Profile**
4. Open **Token Access**
5. Create a new token
6. Copy the token into the `.env` file

Example:

```env
ZAMMAD_TOKEN=abc123yourtokenhere
```

---

## How to create the Telegram bot token

In Telegram:

1. Search for **@BotFather**
2. Run:

```text
/newbot
```

3. Follow the steps
4. Copy the bot token
5. Paste it into the `.env` file

Example:

```env
TELEGRAM_TOKEN=1234567890:AAExampleTokenHere
```

---

## Bot Code Example

Create the file:

```text
src/bot.js
```

Put The code in the bot.js in The Project 


---

## Run the bot

Start the bot with:

```bash
node src/bot.js
```

If everything is correct, the bot will start and wait for messages.

---

## How to test

Open your Telegram bot and send:

```text
/start
```

Then:

```text
/support
```

Then send a real issue, for example:

```text
My VPN is not working
```

If the connection is correct, a new ticket will be created in Zammad.

---

## Example Ticket Content in Zammad

The ticket can include information like:

* Telegram Name
* Telegram Username
* Telegram ID
* User problem text

Example body:

```text
Telegram Name: Mahtab
Telegram Username: @exampleuser
Telegram ID: 123456789

Problem:
My VPN is not working
```

---

## Common Errors

### 1. `401 Unauthorized`

This usually means the **Telegram bot token** or **Zammad token** is wrong.

Check your `.env` file carefully.

### 2. `Cannot find package 'grammy'`

Install dependencies:

```bash
npm install grammy axios dotenv
```

### 3. `Cannot use import statement outside a module`

Add this to `package.json`:

```json
"type": "module"
```

Example:

```json
{
  "name": "zammadtelegram",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js"
}
```

---

## Future Improvements

Possible next steps:

* Add ticket priority selection
* Add category selection
* Add `/mytickets`
* Show ticket status in Telegram
* Send support replies back to Telegram
* Map each Telegram user to a real Zammad customer

---

## Why this project is useful

This project is a good portfolio example because it shows:

* API integration
* Telegram bot development
* Node.js backend work
* IT support workflow automation
* Real ticket system usage with Zammad
