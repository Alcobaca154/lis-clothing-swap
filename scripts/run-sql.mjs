// Runs a SQL file against the cloud Supabase project via the Management API
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

const PROJECT_REF = 'heqvaphfcrmjyfybkpoc'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const SQL_FILE = process.argv[2]

if (!ACCESS_TOKEN) {
  console.error('Missing SUPABASE_ACCESS_TOKEN env var')
  process.exit(1)
}
if (!SQL_FILE) {
  console.error('Usage: node scripts/run-sql.mjs <path-to-sql-file>')
  process.exit(1)
}

const sql = readFileSync(join(__dir, '..', SQL_FILE), 'utf8')

console.log(`Running ${SQL_FILE} …`)

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  }
)

const body = await res.json()

if (!res.ok) {
  console.error('Error:', JSON.stringify(body, null, 2))
  process.exit(1)
}

console.log('Done.')
