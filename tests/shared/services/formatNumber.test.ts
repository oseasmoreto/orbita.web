import { formatDecimal, formatMoney, formatPercent } from '@/shared/services/formatNumber'

const FIFTY_NINE_NINETY = /R\$\s*59,90/
const NINETEEN_NINETY_NINE_NINETY = /R\$\s*1\.999,90/
const ZERO_MONEY = /R\$\s*0,00/

describe('formatMoney', () => {
  it('formats a numeric string as BRL currency', () => {
    expect(formatMoney('59.90')).toMatch(FIFTY_NINE_NINETY)
  })

  it('formats a plain number the same way', () => {
    expect(formatMoney(1999.9)).toMatch(NINETEEN_NINETY_NINE_NINETY)
  })

  it('formats zero', () => {
    expect(formatMoney('0')).toMatch(ZERO_MONEY)
  })
})

describe('formatDecimal', () => {
  it('formats a numeric string in pt-BR decimal style, no currency symbol', () => {
    expect(formatDecimal('59.90')).toBe('59,90')
  })

  it('formats a plain number the same way, with thousands separator', () => {
    expect(formatDecimal(1999.9)).toBe('1.999,90')
  })

  it('always shows 2 decimal places, even for a whole number', () => {
    expect(formatDecimal('75')).toBe('75,00')
  })

  it('never includes the "R$" currency symbol', () => {
    expect(formatDecimal('59.90')).not.toContain('R$')
  })
})

describe('formatPercent', () => {
  it('formats a numeric string with no decimals by default', () => {
    expect(formatPercent('20.00')).toBe('20%')
  })

  it('respects a custom fraction digit count, pt-BR comma decimal', () => {
    expect(formatPercent('12.5', 1)).toBe('12,5%')
  })

  it('formats a plain number the same way', () => {
    expect(formatPercent(7)).toBe('7%')
  })
})
