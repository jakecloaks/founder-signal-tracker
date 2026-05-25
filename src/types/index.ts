export type GrowthStatus = 'scaling' | 'expanding' | 'warming' | 'watching'

export type SignalType =
  | 'hiring_sdrs'
  | 'meta_ads'
  | 'founder_scaling_post'
  | 'new_landing_page'
  | 'product_launch'
  | 'team_expansion'
  | 'funding_signal'
  | 'linkedin_outreach'

export interface Signal {
  id: string
  type: SignalType
  label: string
  description: string
  strength: number
  detectedAt: string
}

export interface FeedEvent {
  id: string
  companyId: string
  companyName: string
  signal: string
  timestamp: string
  intentScore: number
}

export interface ActivityEvent {
  id: string
  title: string
  description: string
  timestamp: string
}

export interface IntentBreakdown {
  hiring: number
  marketing: number
  product: number
  social: number
  funding: number
}

export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  logo: string
  intentScore: number
  growthStatus: GrowthStatus
  signals: Signal[]
  aiSummary: string
  outreachAngle: string
  outreachRecommendation: string
  intentBreakdown: IntentBreakdown
  recentActivity: ActivityEvent[]
  signalStrength: number
  sources?: {
    website?: string | null
    websiteError?: string | null
    newsError?: string | null
    articleCount?: number
  }
}

export type OpportunityCategory =
  | 'high_potential'
  | 'under_optimized'
  | 'scaling_fast'
  | 'weak_digital_presence'
  | 'strong_competitor'
  | 'needs_automation'

export type BusinessMaturity = 'early' | 'growing' | 'established' | 'mature'

export type ContactMethod = 'instagram' | 'phone' | 'website_form' | 'email' | 'facebook'

export interface ContactChannelVisibility {
  instagram: number
  facebook: number
  phone: number
  website_form: number
  email: number
}

export interface DigitalFootprint {
  websiteExists: boolean
  websiteQualityScore: number
  instagramExists: boolean
  instagramActivityScore: number
  facebookExists: boolean
  facebookActivityScore: number
  brandingScore: number
  consistencyScore: number
  reviewQualityScore: number
  digitalPresenceStrength: number
  marketingMaturity: number
  growthIntent: number
}

export type BusinessDataSource = 'mock' | 'google_places'

export interface LocalBusiness {
  id: string
  name: string
  industry: string
  location: string
  address: string
  placeId?: string
  phone?: string | null
  websiteUrl?: string | null
  dataSource: BusinessDataSource
  googleRating: number
  reviewCount: number
  footprint: DigitalFootprint
  opportunityScore: number
  opportunityCategory: OpportunityCategory
  categories: OpportunityCategory[]
  weaknesses: string[]
  outreachOpener: string
  serviceSuggestion: string
  painPoint: string
  businessMaturity: BusinessMaturity
  outreachAngle: string
  aiSummary: string
  outreachRecommendation: string
  suggestedServicePitch: string
  logo: string
  distance: string
  lastUpdated: string
  activeGrowth: boolean
  serviceType: string
  fitScore: number
  fitExplanation: string
  bestContactMethod: ContactMethod
  bestContactMethodReason: string
  contactChannelVisibility: ContactChannelVisibility
}

export type BusinessFilterKey =
  | 'all'
  | 'has_website'
  | 'no_website'
  | 'high_opportunity'
  | 'weak_social'
  | 'high_reviews'
  | 'low_reviews'
  | 'active_growth'

export interface BusinessFilters {
  active: BusinessFilterKey
}
