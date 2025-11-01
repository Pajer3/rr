import { put, list } from '@vercel/blob'

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

const BLOB_PATHNAME = 'visitor-logs.json'

async function readLogs(): Promise<VisitorLog[]> {
  try {
    // List blobs to find our file
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    const logBlob = blobs.find(blob => blob.pathname === BLOB_PATHNAME)

    if (!logBlob) {
      // Blob doesn't exist yet, return empty array
      return []
    }

    // Fetch the blob content using the URL
    const response = await fetch(logBlob.url)

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error reading logs from blob:', error)
    return []
  }
}

async function writeLogs(logs: VisitorLog[]) {
  try {
    const blob = await put(BLOB_PATHNAME, JSON.stringify(logs, null, 2), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false, // Important: keep the same filename
    })
    console.log('Blob written successfully:', blob.url)
  } catch (error) {
    console.error('Error writing logs to blob:', error)
    throw error
  }
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
