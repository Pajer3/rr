import { promises as fs } from 'fs'
import path from 'path'

// Fallback to JSON storage for serverless environments (Vercel)
const jsonPath = path.join(process.cwd(), 'data', 'visitor-logs.json')

export interface VisitorLog {
  id: string
  timestamp: string
  page: string
  ip: string
  user_agent: string
  country?: string
  city?: string
  region?: string
  timezone?: string
  latitude?: number
  longitude?: number
  created_at?: number
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readLogs(): Promise<VisitorLog[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(jsonPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeLogs(logs: VisitorLog[]) {
  await ensureDataDirectory()
  await fs.writeFile(jsonPath, JSON.stringify(logs, null, 2))
}

export async function insertVisitorLog(log: Omit<VisitorLog, 'created_at'>) {
  const logs = await readLogs()

  const newLog = {
    ...log,
    created_at: Date.now()
  }

  logs.unshift(newLog)
  await writeLogs(logs)
}

export async function getVisitorLogs(limit = 20, offset = 0): Promise<VisitorLog[]> {
  const logs = await readLogs()
  return logs.slice(offset, offset + limit)
}

export async function getTotalLogsCount(): Promise<number> {
  const logs = await readLogs()
  return logs.length
}

export async function cleanupOldLogs(keepCount = 100) {
  const logs = await readLogs()

  if (logs.length > keepCount) {
    const trimmedLogs = logs.slice(0, keepCount)
    await writeLogs(trimmedLogs)
  }
}

export async function getStats() {
  const logs = await readLogs()

  const pageViewsMap: { [key: string]: number } = {}
  const countriesMap: { [key: string]: number } = {}

  logs.forEach(log => {
    pageViewsMap[log.page] = (pageViewsMap[log.page] || 0) + 1
    if (log.country) {
      countriesMap[log.country] = (countriesMap[log.country] || 0) + 1
    }
  })

  const pageViews = Object.entries(pageViewsMap)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)

  const countries = Object.entries(countriesMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)

  return { pageViews, countries }
}
