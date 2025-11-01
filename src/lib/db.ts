import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'visitors.db')

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')

    // Create table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        page TEXT NOT NULL,
        ip TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        country TEXT,
        city TEXT,
        region TEXT,
        timezone TEXT,
        latitude REAL,
        longitude REAL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `)

    // Create index on timestamp for faster queries
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON visitor_logs(timestamp DESC)
    `)

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_created_at ON visitor_logs(created_at DESC)
    `)
  }

  return db
}

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

export function insertVisitorLog(log: Omit<VisitorLog, 'created_at'>) {
  const db = getDatabase()

  const stmt = db.prepare(`
    INSERT INTO visitor_logs (id, timestamp, page, ip, user_agent, country, city, region, timezone, latitude, longitude)
    VALUES (@id, @timestamp, @page, @ip, @user_agent, @country, @city, @region, @timezone, @latitude, @longitude)
  `)

  stmt.run({
    id: log.id,
    timestamp: log.timestamp,
    page: log.page,
    ip: log.ip,
    user_agent: log.user_agent,
    country: log.country || null,
    city: log.city || null,
    region: log.region || null,
    timezone: log.timezone || null,
    latitude: log.latitude || null,
    longitude: log.longitude || null,
  })
}

export function getVisitorLogs(limit = 20, offset = 0): VisitorLog[] {
  const db = getDatabase()

  const stmt = db.prepare(`
    SELECT * FROM visitor_logs
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `)

  return stmt.all(limit, offset) as VisitorLog[]
}

export function getTotalLogsCount(): number {
  const db = getDatabase()
  const result = db.prepare('SELECT COUNT(*) as count FROM visitor_logs').get() as { count: number }
  return result.count
}

export function cleanupOldLogs(keepCount = 100) {
  const db = getDatabase()

  // Delete all logs except the most recent keepCount
  db.prepare(`
    DELETE FROM visitor_logs
    WHERE id NOT IN (
      SELECT id FROM visitor_logs
      ORDER BY created_at DESC
      LIMIT ?
    )
  `).run(keepCount)
}

export function getStats() {
  const db = getDatabase()

  const pageViews = db.prepare(`
    SELECT page, COUNT(*) as count
    FROM visitor_logs
    GROUP BY page
    ORDER BY count DESC
  `).all() as Array<{ page: string; count: number }>

  const countries = db.prepare(`
    SELECT country, COUNT(*) as count
    FROM visitor_logs
    WHERE country IS NOT NULL
    GROUP BY country
    ORDER BY count DESC
  `).all() as Array<{ country: string; count: number }>

  return { pageViews, countries }
}
