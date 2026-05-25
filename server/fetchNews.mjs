const NEWS_HIRING_PATTERNS = [
  { pattern: /\b(hiring|hires|job cuts reversed|workforce|headcount)\b/i, label: 'Hiring mentioned in news' },
  { pattern: /\b(funding|raised|series|investment|valuation)\b/i, label: 'Funding news' },
  { pattern: /\b(launch|partnership|expansion|acquisition)\b/i, label: 'Growth / launch news' },
  { pattern: /\b(revenue|customers|enterprise)\b/i, label: 'Commercial traction news' },
]

export function detectNewsIndicators(articles) {
  const found = []
  const blob = articles.map((a) => `${a.title} ${a.description}`).join(' ')

  for (const { pattern, label } of NEWS_HIRING_PATTERNS) {
    if (pattern.test(blob) && !found.some((f) => f.label === label)) {
      found.push({ source: 'news', label, confidence: 'medium' })
    }
  }

  return found
}

export async function fetchCompanyNews(searchName) {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    return { articles: [], indicators: [], error: 'NEWS_API_KEY not configured' }
  }

  const q = encodeURIComponent(`${searchName} company`)
  const url = `https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=6&language=en&apiKey=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`NewsAPI error: ${res.status} ${text.slice(0, 120)}`)
  }

  const data = await res.json()
  if (data.status === 'error') {
    throw new Error(data.message || 'NewsAPI request failed')
  }

  const articles = (data.articles ?? []).map((a) => ({
    title: a.title ?? '',
    description: a.description ?? '',
    url: a.url ?? '',
    publishedAt: a.publishedAt ?? '',
    source: a.source?.name ?? '',
  }))

  return {
    articles,
    indicators: detectNewsIndicators(articles),
    error: null,
  }
}
