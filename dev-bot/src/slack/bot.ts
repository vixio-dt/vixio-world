import { App } from '@slack/bolt'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load from root .env.local
config({ path: resolve(process.cwd(), '../.env.local') })

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
})

export async function startBot() {
  await app.start()
  console.log('⚡️ Vixio Dev Bot is running!')
}
