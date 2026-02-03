import { App } from '@slack/bolt'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load from root .env.local using import.meta.url for reliable path resolution
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../../../.env.local') })

// Validate required environment variables
function validateEnv(): { botToken: string; appToken: string } {
  const botToken = process.env.SLACK_BOT_TOKEN
  const appToken = process.env.SLACK_APP_TOKEN

  if (!botToken) {
    throw new Error(
      'SLACK_BOT_TOKEN is required. Get it from your Slack app settings > OAuth & Permissions.'
    )
  }

  if (!appToken) {
    throw new Error(
      'SLACK_APP_TOKEN is required. Get it from your Slack app settings > Basic Information > App-Level Tokens.'
    )
  }

  return { botToken, appToken }
}

const { botToken, appToken } = validateEnv()

export const app = new App({
  token: botToken,
  appToken: appToken,
  socketMode: true,
})

export async function startBot() {
  await app.start()
  console.log('⚡️ Vixio Dev Bot is running!')
}
