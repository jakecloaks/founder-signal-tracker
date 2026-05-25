import { normalizeQuery, fetchWebsiteMetadata } from './fetchWebsite.mjs'
import { fetchCompanyNews } from './fetchNews.mjs'
import { generateIntelligence } from './llm.mjs'

export async function analyzeCompany(query) {
  const { domain, name, searchName } = normalizeQuery(query)

  const [website, news] = await Promise.all([
    domain ? fetchWebsiteMetadata(domain) : Promise.resolve({
      url: null,
      title: name,
      description: '',
      bodySnippet: '',
      indicators: [],
      error: 'name_only_query',
    }),
    fetchCompanyNews(searchName).catch((err) => ({
      articles: [],
      indicators: [],
      error: err instanceof Error ? err.message : 'news_failed',
    })),
  ])

  const resolvedDomain = domain || (website.title ? '' : '')
  const resolvedName = website.title && domain ? website.title.split('|')[0].trim() : name

  const allIndicators = [...(website.indicators ?? []), ...(news.indicators ?? [])]

  const payload = {
    company: {
      query,
      name: resolvedName,
      domain: resolvedDomain || domain,
      searchName,
    },
    website: {
      url: website.url,
      title: website.title,
      description: website.description,
      bodySnippet: website.bodySnippet?.slice(0, 1500),
      fetchError: website.error,
    },
    news: {
      fetchError: news.error,
      articles: news.articles?.slice(0, 6) ?? [],
    },
    heuristicIndicators: allIndicators,
  }

  const intelligence = await generateIntelligence(payload)

  const now = new Date().toISOString()
  const signals = intelligence.signals.map((s, i) => ({
    id: `sig-${Date.now()}-${i}`,
    type: s.type,
    label: s.label,
    description: s.description,
    strength: s.strength,
    detectedAt: now,
  }))

  const recentActivity = intelligence.recentActivity.map((a, i) => ({
    id: `act-${Date.now()}-${i}`,
    title: a.title,
    description: a.description,
    timestamp: now,
  }))

  if (news.articles?.length && recentActivity.length < 5) {
    for (const article of news.articles.slice(0, 3)) {
      if (recentActivity.length >= 5) break
      recentActivity.push({
        id: `news-${Date.now()}-${recentActivity.length}`,
        title: article.title,
        description: article.source ? `${article.source} — ${article.description}`.slice(0, 200) : article.description,
        timestamp: article.publishedAt || now,
      })
    }
  }

  const intentScore = intelligence.intentScore
  const growthStatus =
    intentScore >= 80 ? 'scaling' :
    intentScore >= 65 ? 'expanding' :
    intentScore >= 45 ? 'warming' : 'watching'

  const signalStrength =
    signals.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            signals.reduce((s, sig) => s + sig.strength, 0) / signals.length * 0.7 +
              Math.min(20, signals.length * 4)
          )
        )

  const initials = intelligence.name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??'

  return {
    id: `co-${Date.now()}`,
    name: intelligence.name,
    domain: intelligence.domain || domain || searchName.toLowerCase().replace(/\s+/g, '') + '.com',
    industry: intelligence.industry,
    logo: initials,
    intentScore,
    growthStatus,
    signals,
    aiSummary: intelligence.aiSummary,
    outreachAngle: intelligence.outreachAngle,
    outreachRecommendation: intelligence.outreachRecommendation,
    intentBreakdown: intelligence.intentBreakdown,
    recentActivity,
    signalStrength,
    analyzedAt: now,
    sources: {
      website: website.url,
      websiteError: website.error,
      newsError: news.error,
      articleCount: news.articles?.length ?? 0,
    },
  }
}
