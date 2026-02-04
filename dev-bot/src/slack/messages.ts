import type { Task } from '../state/types.js'

export function formatRequirementForm(task: Task, aiSuggestion: {
  feature: string
  userStory: string
  acceptanceCriteria: string[]
}) {
  return {
    text: `📋 New Task: ${task.description}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Requirement Form' }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Feature:* ${aiSuggestion.feature}\n\n*User Story:* ${aiSuggestion.userStory}`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Acceptance Criteria:*\n' + aiSuggestion.acceptanceCriteria.map(c => `• ${c}`).join('\n')
        }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `*Complexity:* ${task.complexity} (${task.totalPhases} phase${task.totalPhases > 1 ? 's' : ''})` }
        ]
      },
      {
        type: 'actions',
        block_id: `task_approval_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            style: 'primary',
            action_id: 'approve_task',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '✏️ Edit' },
            action_id: 'edit_task',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Reject' },
            style: 'danger',
            action_id: 'reject_task',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatPhaseComplete(task: Task, phaseName: string, summary: string) {
  return {
    text: `Phase ${task.currentPhase} complete`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📋 Phase ${task.currentPhase} Complete: ${phaseName}` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: summary }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Branch: \`${task.branch}\`` }
        ]
      },
      {
        type: 'actions',
        block_id: `phase_approval_${task.id}_${task.currentPhase}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: `✅ Approve Phase ${task.currentPhase + 1}` },
            style: 'primary',
            action_id: 'approve_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔄 Retry Phase' },
            action_id: 'retry_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🛑 Abort' },
            style: 'danger',
            action_id: 'abort_task',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatQuickComplete(task: Task, summary: string, prUrl: string) {
  return {
    text: `✅ Done: ${task.description}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *Done:* ${task.description}\n\n${summary}\n\nPR: <${prUrl}|View>`
        }
      },
      {
        type: 'actions',
        block_id: `merge_approval_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve Merge' },
            style: 'primary',
            action_id: 'approve_merge',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '💬 Request Changes' },
            action_id: 'request_changes',
            value: task.id
          }
        ]
      }
    ]
  }
}

export function formatError(task: Task, error: string) {
  return {
    text: `⚠️ Task blocked`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '⚠️ Task Blocked' }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Error:*\n\`\`\`${error}\`\`\`` }
      },
      {
        type: 'actions',
        block_id: `error_${task.id}`,
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '🔄 Retry' },
            action_id: 'retry_phase',
            value: task.id
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '🛑 Abort' },
            style: 'danger',
            action_id: 'abort_task',
            value: task.id
          }
        ]
      }
    ]
  }
}
