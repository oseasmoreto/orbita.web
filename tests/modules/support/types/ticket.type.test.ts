import pt from '@/core/i18n/messages/pt-BR'
import { ticketStatusLabelKey } from '@/modules/support/types/ticket.type'

describe('ticketStatusLabelKey', () => {
  it('resolves every TicketStatus to a key that actually exists in the pt-BR catalog', () => {
    const statuses = ['open', 'in_progress', 'resolved'] as const

    for (const status of statuses) {
      const key = ticketStatusLabelKey(status)
      const value = key
        .split('.')
        .reduce<unknown>(
          (node, segment) =>
            typeof node === 'object' && node !== null
              ? (node as Record<string, unknown>)[segment]
              : undefined,
          pt,
        )

      expect(typeof value).toBe('string')
    }
  })

  it('never returns the raw snake_case status as-is (the bug that shipped once)', () => {
    expect(ticketStatusLabelKey('in_progress')).not.toContain('in_progress')
  })
})
