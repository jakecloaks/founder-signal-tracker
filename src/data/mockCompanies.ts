import type { Company, FeedEvent } from '../types'
import { enrichCompany } from '../utils/signalEngine'

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()

const rawCompanies: Omit<
  Company,
  'intentScore' | 'growthStatus' | 'aiSummary' | 'outreachRecommendation' | 'intentBreakdown' | 'signalStrength'
>[] = [
  {
    id: '1',
    name: 'ScaleForge AI',
    domain: 'scaleforge.ai',
    industry: 'AI Automation',
    logo: 'SF',
    outreachAngle: 'Scale outbound without hiring 3 more SDRs',
    signals: [
      { id: 's1', type: 'hiring_sdrs', label: 'Hiring SDRs', description: '3 SDR roles posted on LinkedIn', strength: 92, detectedAt: hoursAgo(2) },
      { id: 's2', type: 'meta_ads', label: 'Running Meta ads', description: 'New ad creatives detected in Meta Ad Library', strength: 78, detectedAt: hoursAgo(5) },
      { id: 's3', type: 'founder_scaling_post', label: 'Founder scaling post', description: 'CEO posted about 3x pipeline goals', strength: 85, detectedAt: hoursAgo(8) },
    ],
    recentActivity: [
      { id: 'a1', title: 'SDR job postings live', description: '3 new roles on careers page', timestamp: hoursAgo(2) },
      { id: 'a2', title: 'Meta ad spend increased', description: '12 new creatives in last 7 days', timestamp: hoursAgo(5) },
      { id: 'a3', title: 'Founder LinkedIn post', description: 'Scaling GTM team Q2', timestamp: hoursAgo(8) },
    ],
  },
  {
    id: '2',
    name: 'GrowthLoop',
    domain: 'growthloop.io',
    industry: 'SaaS / RevOps',
    logo: 'GL',
    outreachAngle: 'Unify your GTM signals before Q3 planning',
    signals: [
      { id: 's4', type: 'product_launch', label: 'Recent product launch', description: 'Analytics v2 shipped with enterprise tier', strength: 88, detectedAt: hoursAgo(4) },
      { id: 's5', type: 'team_expansion', label: 'Team expansion', description: 'Engineering headcount up 40% YoY', strength: 72, detectedAt: daysAgo(1) },
      { id: 's6', type: 'new_landing_page', label: 'New landing pages', description: 'Enterprise pricing page detected', strength: 80, detectedAt: hoursAgo(12) },
    ],
    recentActivity: [
      { id: 'a4', title: 'Product launch announced', description: 'Analytics v2 on blog', timestamp: hoursAgo(4) },
      { id: 'a5', title: 'Enterprise page live', description: 'New pricing tier surfaced', timestamp: hoursAgo(12) },
    ],
  },
  {
    id: '3',
    name: 'VectorLabs',
    domain: 'vectorlabs.co',
    industry: 'AI Infrastructure',
    logo: 'VL',
    outreachAngle: 'Help your ML team ship inference 2x faster',
    signals: [
      { id: 's7', type: 'funding_signal', label: 'Funding signal', description: 'Series B rumors + investor follow activity', strength: 95, detectedAt: hoursAgo(1) },
      { id: 's8', type: 'hiring_sdrs', label: 'Hiring SDRs', description: 'Enterprise AE and SDR roles opened', strength: 70, detectedAt: hoursAgo(6) },
      { id: 's9', type: 'founder_scaling_post', label: 'Founder scaling post', description: 'CTO thread on scaling inference infra', strength: 82, detectedAt: hoursAgo(10) },
    ],
    recentActivity: [
      { id: 'a6', title: 'Investor activity spike', description: '5 new mutual connections', timestamp: hoursAgo(1) },
      { id: 'a7', title: 'GTM roles posted', description: '2 sales roles on Greenhouse', timestamp: hoursAgo(6) },
    ],
  },
  {
    id: '4',
    name: 'OmniFlow',
    domain: 'omniflow.app',
    industry: 'Workflow Automation',
    logo: 'OF',
    outreachAngle: 'Automate client onboarding before your next hire',
    signals: [
      { id: 's10', type: 'meta_ads', label: 'Running Meta ads', description: 'Retargeting campaigns active', strength: 65, detectedAt: hoursAgo(3) },
      { id: 's11', type: 'new_landing_page', label: 'New landing pages', description: 'Agency partner program page', strength: 74, detectedAt: daysAgo(2) },
    ],
    recentActivity: [
      { id: 'a8', title: 'Partner program page', description: 'Agency tier announced', timestamp: daysAgo(2) },
      { id: 'a9', title: 'Ad campaigns detected', description: 'Meta spend up 22%', timestamp: hoursAgo(3) },
    ],
  },
  {
    id: '5',
    name: 'SignalStack',
    domain: 'signalstack.dev',
    industry: 'Developer Tools',
    logo: 'SS',
    outreachAngle: 'Reduce alert fatigue for your platform team',
    signals: [
      { id: 's12', type: 'product_launch', label: 'Recent product launch', description: 'Observability hub beta released', strength: 90, detectedAt: hoursAgo(2) },
      { id: 's13', type: 'team_expansion', label: 'Team expansion', description: 'DevRel and solutions roles posted', strength: 68, detectedAt: daysAgo(1) },
      { id: 's14', type: 'linkedin_outreach', label: 'LinkedIn activity', description: 'Founders engaging with enterprise prospects', strength: 55, detectedAt: hoursAgo(7) },
    ],
    recentActivity: [
      { id: 'a10', title: 'Beta launch', description: 'Observability hub live', timestamp: hoursAgo(2) },
      { id: 'a11', title: 'DevRel hiring', description: '2 roles on Ashby', timestamp: daysAgo(1) },
    ],
  },
  {
    id: '6',
    name: 'ApexPilot',
    domain: 'apexpilot.com',
    industry: 'Sales AI',
    logo: 'AP',
    outreachAngle: 'Pilot AI SDR workflows on your ICP in 14 days',
    signals: [
      { id: 's15', type: 'hiring_sdrs', label: 'Hiring SDRs', description: '5 SDR/BDR roles across US and EU', strength: 98, detectedAt: hoursAgo(1) },
      { id: 's16', type: 'meta_ads', label: 'Running Meta ads', description: 'Heavy LinkedIn + Meta spend', strength: 86, detectedAt: hoursAgo(4) },
      { id: 's17', type: 'founder_scaling_post', label: 'Founder scaling post', description: 'CEO: "Doubling outbound this quarter"', strength: 91, detectedAt: hoursAgo(3) },
      { id: 's18', type: 'team_expansion', label: 'Team expansion', description: 'Customer success team doubling', strength: 75, detectedAt: daysAgo(1) },
    ],
    recentActivity: [
      { id: 'a12', title: 'Mass SDR hiring', description: '5 roles live', timestamp: hoursAgo(1) },
      { id: 'a13', title: 'CEO scaling post', description: '2.4k engagements', timestamp: hoursAgo(3) },
      { id: 'a14', title: 'Ad spend surge', description: 'Meta + LinkedIn detected', timestamp: hoursAgo(4) },
    ],
  },
  {
    id: '7',
    name: 'Nexus Agency',
    domain: 'nexusagency.co',
    industry: 'Digital Agency',
    logo: 'NA',
    outreachAngle: 'White-label signal intel for your top 10 clients',
    signals: [
      { id: 's19', type: 'new_landing_page', label: 'New landing pages', description: 'AI services landing page launched', strength: 70, detectedAt: daysAgo(3) },
      { id: 's20', type: 'meta_ads', label: 'Running Meta ads', description: 'Case study promotion ads', strength: 60, detectedAt: hoursAgo(9) },
    ],
    recentActivity: [
      { id: 'a15', title: 'AI services page', description: 'New service line', timestamp: daysAgo(3) },
    ],
  },
  {
    id: '8',
    name: 'CloudMint',
    domain: 'cloudmint.io',
    industry: 'Cloud SaaS',
    logo: 'CM',
    outreachAngle: 'Cut cloud costs 20% before your next funding round',
    signals: [
      { id: 's21', type: 'funding_signal', label: 'Funding signal', description: 'Preparing data room — hiring freeze lifted', strength: 72, detectedAt: daysAgo(2) },
      { id: 's22', type: 'product_launch', label: 'Recent product launch', description: 'FinOps dashboard shipped', strength: 78, detectedAt: hoursAgo(15) },
    ],
    recentActivity: [
      { id: 'a16', title: 'FinOps launch', description: 'New product page', timestamp: hoursAgo(15) },
    ],
  },
  {
    id: '9',
    name: 'PulseMetrics',
    domain: 'pulsemetrics.ai',
    industry: 'Analytics / AI',
    logo: 'PM',
    outreachAngle: 'Turn product usage data into outbound triggers',
    signals: [
      { id: 's23', type: 'founder_scaling_post', label: 'Founder scaling post', description: 'Weekly growth updates resumed', strength: 66, detectedAt: hoursAgo(6) },
      { id: 's24', type: 'team_expansion', label: 'Team expansion', description: 'Data science team hiring', strength: 58, detectedAt: daysAgo(4) },
    ],
    recentActivity: [
      { id: 'a17', title: 'Growth thread series', description: 'Founder posting weekly', timestamp: hoursAgo(6) },
    ],
  },
  {
    id: '10',
    name: 'AutomateHQ',
    domain: 'automatehq.com',
    industry: 'AI Consultancy',
    logo: 'AH',
    outreachAngle: 'Package signal monitoring into your retainer offers',
    signals: [
      { id: 's25', type: 'hiring_sdrs', label: 'Hiring SDRs', description: 'Partnerships lead + 2 SDRs', strength: 84, detectedAt: hoursAgo(5) },
      { id: 's26', type: 'linkedin_outreach', label: 'LinkedIn activity', description: 'Heavy outbound on AI transformation', strength: 72, detectedAt: hoursAgo(2) },
      { id: 's27', type: 'new_landing_page', label: 'New landing pages', description: 'Enterprise AI audit CTA page', strength: 77, detectedAt: daysAgo(1) },
    ],
    recentActivity: [
      { id: 'a18', title: 'Partnerships hiring', description: '3 GTM roles', timestamp: hoursAgo(5) },
      { id: 'a19', title: 'Audit landing page', description: 'New lead magnet', timestamp: daysAgo(1) },
    ],
  },
  {
    id: '11',
    name: 'DataForge',
    domain: 'dataforge.io',
    industry: 'Data Platform',
    logo: 'DF',
    outreachAngle: 'Pipeline intelligence for your enterprise data team',
    signals: [
      { id: 's28', type: 'product_launch', label: 'Recent product launch', description: 'Real-time ETL connector pack', strength: 82, detectedAt: hoursAgo(7) },
      { id: 's29', type: 'team_expansion', label: 'Team expansion', description: 'Solutions engineering hiring spree', strength: 64, detectedAt: daysAgo(2) },
    ],
    recentActivity: [
      { id: 'a20', title: 'Connector pack launch', description: 'Product blog post', timestamp: hoursAgo(7) },
    ],
  },
  {
    id: '12',
    name: 'RevPilot',
    domain: 'revpilot.co',
    industry: 'Revenue Intelligence',
    logo: 'RP',
    outreachAngle: 'Beat competitors to accounts showing buying intent',
    signals: [
      { id: 's30', type: 'hiring_sdrs', label: 'Hiring SDRs', description: 'SDR manager + 4 reps', strength: 94, detectedAt: hoursAgo(2) },
      { id: 's31', type: 'meta_ads', label: 'Running Meta ads', description: 'Competitor comparison ads live', strength: 81, detectedAt: hoursAgo(6) },
      { id: 's32', type: 'founder_scaling_post', label: 'Founder scaling post', description: 'Series A closing — scaling GTM', strength: 88, detectedAt: hoursAgo(4) },
    ],
    recentActivity: [
      { id: 'a21', title: 'GTM hiring wave', description: '5 roles posted', timestamp: hoursAgo(2) },
      { id: 'a22', title: 'Comparison ads', description: 'Targeting competitor keywords', timestamp: hoursAgo(6) },
    ],
  },
]

export const companies: Company[] = rawCompanies.map((c) => enrichCompany(c))

export const feedEvents: FeedEvent[] = [
  { id: 'f1', companyId: '6', companyName: 'ApexPilot', signal: 'Hiring 5 SDRs across US & EU', timestamp: hoursAgo(0.5), intentScore: 94 },
  { id: 'f2', companyId: '3', companyName: 'VectorLabs', signal: 'Series B funding signals detected', timestamp: hoursAgo(1), intentScore: 89 },
  { id: 'f3', companyId: '1', companyName: 'ScaleForge AI', signal: 'Founder posted about 3x pipeline', timestamp: hoursAgo(1.5), intentScore: 87 },
  { id: 'f4', companyId: '12', companyName: 'RevPilot', signal: 'SDR manager role + 4 reps live', timestamp: hoursAgo(2), intentScore: 91 },
  { id: 'f5', companyId: '5', companyName: 'SignalStack', signal: 'Observability hub beta launched', timestamp: hoursAgo(2.5), intentScore: 78 },
  { id: 'f6', companyId: '10', companyName: 'AutomateHQ', signal: 'Enterprise AI audit page detected', timestamp: hoursAgo(3), intentScore: 82 },
  { id: 'f7', companyId: '2', companyName: 'GrowthLoop', signal: 'Enterprise pricing page live', timestamp: hoursAgo(4), intentScore: 76 },
  { id: 'f8', companyId: '6', companyName: 'ApexPilot', signal: 'Meta ad spend up 34% this week', timestamp: hoursAgo(4.5), intentScore: 94 },
  { id: 'f9', companyId: '8', companyName: 'CloudMint', signal: 'FinOps dashboard product launch', timestamp: hoursAgo(5), intentScore: 71 },
  { id: 'f10', companyId: '4', companyName: 'OmniFlow', signal: 'Agency partner program page', timestamp: hoursAgo(6), intentScore: 58 },
  { id: 'f11', companyId: '11', companyName: 'DataForge', signal: 'Real-time ETL connector pack shipped', timestamp: hoursAgo(7), intentScore: 74 },
  { id: 'f12', companyId: '9', companyName: 'PulseMetrics', signal: 'Founder resumed weekly growth posts', timestamp: hoursAgo(8), intentScore: 52 },
]
