import { startBot, app } from './slack/bot.js'

// Simple echo handler for testing
app.message(async ({ message, say }) => {
  if (message.subtype) return // Ignore non-user messages
  if ('text' in message && message.text) {
    await say(`Echo: ${message.text}`)
  }
})

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await app.stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...')
  await app.stop()
  process.exit(0)
})

startBot().catch(console.error)
