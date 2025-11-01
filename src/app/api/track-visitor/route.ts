import { NextRequest, NextResponse } from 'next/server'
import { insertVisitorLog, getVisitorLogs, getTotalLogsCount, cleanupOldLogs, getStats } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page } = body

    // Get IP address from request headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Fetch geolocation data using ip-api.com (free, no API key needed)
    let geoData: Record<string, unknown> = {}

    // For localhost/development, use mock data
    if (ip === '::1' || ip === '127.0.0.1') {
      geoData = {
        country: 'Netherlands',
        city: 'Amersfoort',
        regionName: 'Utrecht',
        timezone: 'Europe/Amsterdam',
        lat: 52.1561,
        lon: 5.3878
      }
    } else if (ip !== 'unknown') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}`)
        if (geoResponse.ok) {
          geoData = await geoResponse.json()
        }
      } catch (error) {
        console.error('Geolocation fetch error:', error)
      }
    }

    const log = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      page,
      ip,
      user_agent: userAgent,
      country: typeof geoData.country === 'string' ? geoData.country : undefined,
      city: typeof geoData.city === 'string' ? geoData.city : undefined,
      region: typeof geoData.regionName === 'string' ? geoData.regionName : undefined,
      timezone: typeof geoData.timezone === 'string' ? geoData.timezone : undefined,
      latitude: typeof geoData.lat === 'number' ? geoData.lat : undefined,
      longitude: typeof geoData.lon === 'number' ? geoData.lon : undefined,
    }

    // Insert log into database
    await insertVisitorLog(log)

    // Cleanup old logs (keep only last 100)
    await cleanupOldLogs(100)

    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json({ success: false, error: 'Failed to track visitor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    // Hardcoded password - use simple characters to avoid URL encoding issues
    const adminPassword = 'Frisspits2025AdminSecurePassword123'

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pagination params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get logs with pagination (await the promises)
    const logs = await getVisitorLogs(limit, offset)
    const total = await getTotalLogsCount()
    const stats = await getStats()

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
