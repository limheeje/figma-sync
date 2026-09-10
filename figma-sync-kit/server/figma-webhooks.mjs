/**
 * Manage the Figma webhook for this project.
 *
 *   node --env-file=.env server/figma-webhooks.mjs list
 *   node --env-file=.env server/figma-webhooks.mjs create [FILE_UPDATE|FILE_VERSION_UPDATE]
 *   node --env-file=.env server/figma-webhooks.mjs delete <webhook_id>
 *
 * Uses the v2 webhooks API with a file-level context.
 * Docs: https://developers.figma.com/docs/rest-api/webhooks-endpoints/
 */
const API = 'https://api.figma.com/v2/webhooks'

const {
  FIGMA_TOKEN,
  FIGMA_FILE_KEY,
  PUBLIC_URL,
  WEBHOOK_PASSCODE,
} = process.env

if (!FIGMA_TOKEN) {
  console.error('Missing FIGMA_TOKEN in .env')
  process.exit(1)
}

const headers = {
  'X-Figma-Token': FIGMA_TOKEN,
  'content-type': 'application/json',
}

const [cmd, arg] = process.argv.slice(2)

async function api(method, path = '', body) {
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = text
  }
  if (!res.ok) {
    console.error(`HTTP ${res.status}`, json)
    process.exit(1)
  }
  return json
}

async function list() {
  // webhooks the token owner created, filtered to this file
  const data = await api('GET', `?context=file&context_id=${FIGMA_FILE_KEY}`)
  const hooks = data.webhooks ?? data
  if (!hooks?.length) {
    console.log('no webhooks for this file')
    return
  }
  for (const h of hooks) {
    console.log(
      `${h.id}  ${h.event_type.padEnd(20)}  ${h.status}  -> ${h.endpoint}`,
    )
  }
}

async function create(eventType = 'FILE_UPDATE') {
  if (!PUBLIC_URL) {
    console.error('Missing PUBLIC_URL in .env')
    process.exit(1)
  }
  const body = {
    event_type: eventType,
    context: 'file',
    context_id: FIGMA_FILE_KEY,
    endpoint: `${PUBLIC_URL.replace(/\/$/, '')}/figma-hook`,
    passcode: WEBHOOK_PASSCODE || '',
    description: 'figma-sync',
  }
  const data = await api('POST', '', body)
  console.log('created:', data.id, '->', body.endpoint)
  console.log('(a PING event should hit your server now)')
}

async function del(id) {
  if (!id) {
    console.error('usage: delete <webhook_id>')
    process.exit(1)
  }
  await api('DELETE', `/${id}`)
  console.log('deleted', id)
}

switch (cmd) {
  case 'list':
    await list()
    break
  case 'create':
    await create(arg)
    break
  case 'delete':
    await del(arg)
    break
  default:
    console.log('commands: list | create [EVENT_TYPE] | delete <id>')
}
