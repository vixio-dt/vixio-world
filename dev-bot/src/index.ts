import { startBot, app } from './slack/bot.js'

// Simple echo handler for testing
app.message(async ({ message, say }) => {
  if (message.subtype) return // Ignore non-user messages
  if ('text' in message && message.text) {
    await say(`Echo: ${message.text}`)
  }
})

startBot().catch(console.error)
