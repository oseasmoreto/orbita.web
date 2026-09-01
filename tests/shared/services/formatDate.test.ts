import dayjs from 'dayjs'
import { formatRelativeTime } from '@/shared/services/formatDate'

const RECENT_HOURS_PATTERN = /há\s*(2\s*horas|umas? horas)/
const JUST_NOW_PATTERN = /há\s*(poucos segundos|um minuto)/

describe('formatRelativeTime', () => {
  it('returns a relative pt-BR string for a recent date', () => {
    const twoHoursAgo = dayjs().subtract(2, 'hour').toISOString()
    expect(formatRelativeTime(twoHoursAgo)).toMatch(RECENT_HOURS_PATTERN)
  })

  it('returns a relative string for "just now"', () => {
    const now = dayjs().toISOString()
    expect(formatRelativeTime(now)).toMatch(JUST_NOW_PATTERN)
  })

  it('returns "—" for null (notification with no created_at)', () => {
    expect(formatRelativeTime(null)).toBe('—')
  })
})
