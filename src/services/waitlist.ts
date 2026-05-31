export interface WaitlistEntry {
  name: string
  email: string
  agencyType: string
  revenue: string
}

export interface WaitlistResult {
  success: boolean
  position: number
  duplicate: boolean
}

export async function submitWaitlist(entry: WaitlistEntry): Promise<WaitlistResult> {
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Submission failed')
  return data as WaitlistResult
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const res = await fetch('/api/waitlist/count')
    const data = await res.json()
    return data.count ?? 0
  } catch {
    return 0
  }
}
