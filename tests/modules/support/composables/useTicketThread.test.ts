import { shouldDisputeOnReply } from '@/modules/support/composables/useTicketThread'

describe('shouldDisputeOnReply', () => {
  it('returns true when the ticket is already resolved (reply reopens it)', () => {
    expect(shouldDisputeOnReply('resolved')).toBe(true)
  })

  it('returns false when the ticket is still open (plain reply, no reopening needed)', () => {
    expect(shouldDisputeOnReply('open')).toBe(false)
  })
})
