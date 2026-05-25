import type { Company } from '../types'

export interface AnalyzeError {
  error: string
}

export async function analyzeCompany(query: string): Promise<Company> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Analysis failed (${res.status})`)
  }

  return data as Company
}
