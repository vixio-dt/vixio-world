// dev-bot/src/index.ts
import { startBot, app } from './slack/bot.js'
import { resultWatcher } from './executor/result-watcher.js'
import { handleNewTask, handleTaskApproval, handlePhaseApproval, handleTaskAbort } from './orchestrator/index.js'

// Handle new messages (task requests)
app.message(async ({ message, say }) => {
  if (message.subtype) return
  if (!('text' in message) || !message.text) return
  if (!('ts' in message)) return
  
  // Ignore bot messages
  if ('bot_id' in message) return
  
  await handleNewTask(message.text, message.channel, message.ts)
})

// Helper to disable buttons by updating message
async function disableButtons(body: any, statusText: string) {
  const channel = body.channel?.id
  const messageTs = body.message?.ts
  if (!channel || !messageTs) return
  
  // Get existing blocks and remove the actions block
  const blocks = (body.message?.blocks || []).filter(
    (block: any) => block.type !== 'actions'
  )
  
  // Add status context
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: statusText }]
  })
  
  await app.client.chat.update({
    channel,
    ts: messageTs,
    blocks,
    text: statusText,
  })
}

// Handle button clicks
app.action('approve_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await disableButtons(body, '✅ *Approved* - Starting...')
  await handleTaskApproval(value)
})

app.action('approve_phase', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await disableButtons(body, '✅ *Phase approved* - Continuing...')
  await handlePhaseApproval(value)
})

app.action('abort_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await disableButtons(body, '🛑 *Aborted*')
  await handleTaskAbort(value)
})

app.action('approve_merge', async ({ ack, body }) => {
  await ack()
  await disableButtons(body, '✅ *Merge approved*')
  // TODO: Implement merge via gh CLI
  const channel = (body as any).channel?.id
  if (channel) {
    await app.client.chat.postMessage({
      channel,
      text: 'Merge approval noted. Implement gh pr merge.',
    })
  }
})

app.action('edit_task', async ({ ack, body }) => {
  await ack()
  await disableButtons(body, '✏️ *Editing...* (not yet implemented)')
  // TODO: Implement edit flow
})

app.action('reject_task', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await disableButtons(body, '❌ *Rejected*')
  await handleTaskAbort(value)
})

app.action('retry_phase', async ({ ack, body }) => {
  await ack()
  const value = (body as any).actions[0].value
  await disableButtons(body, '🔄 *Retrying...*')
  await handleTaskApproval(value) // Re-run current phase
})

app.action('request_changes', async ({ ack, body }) => {
  await ack()
  await disableButtons(body, '💬 *Changes requested* (not yet implemented)')
  // TODO: Implement change request flow
})

// Start everything
async function main() {
  resultWatcher.start()
  await startBot()
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...')
  resultWatcher.stop()
  process.exit(0)
})

main().catch(console.error)
