import type { LocalBusiness } from '../../types'
import { analyzeDigitalPresence } from '../../utils/digitalPresence'
import { buildLocalBusiness } from '../../utils/opportunityEngine'

export const INDUSTRY_ALIASES: Record<string, string> = {
  dentist: 'Dentist',
  dentists: 'Dentist',
  dental: 'Dentist',
  gym: 'Gym',
  gyms: 'Gym',
  fitness: 'Gym',
  salon: 'Salon',
  salons: 'Salon',
  hair: 'Salon',
  roofing: 'Roofing',
  roofer: 'Roofing',
  roof: 'Roofing',
  law: 'Law Firm',
  lawyer: 'Law Firm',
  attorneys: 'Law Firm',
  'law firm': 'Law Firm',
  'law firms': 'Law Firm',
  'real estate': 'Real Estate',
  realtor: 'Real Estate',
  realtors: 'Real Estate',
  agency: 'Real Estate',
  agencies: 'Real Estate',
  restaurant: 'Restaurant',
  restaurants: 'Restaurant',
  plumber: 'Plumber',
  plumbing: 'Plumber',
  chiropractor: 'Chiropractor',
  chiropractic: 'Chiropractor',
}

const NAME_PREFIXES: Record<string, string[]> = {
  Dentist: ['Bright Smile', 'Peak Dental', 'Utah Family', 'Parkview', 'Summit Oral', 'Canyon Creek', 'Wasatch'],
  Gym: ['Iron Forge', 'Peak Performance', 'Metro Fitness', 'Elite Training', 'Pulse Athletic', 'Core Strength'],
  Salon: ['Luxe Studio', 'Bloom & Co', 'Velvet Chair', 'Radiance', 'The Color Bar', 'Studio Nine'],
  Roofing: ['Summit Roof', 'Texas Top', 'Guardian Roofing', 'All-Weather', 'Lone Star Roof', 'Premier Shield'],
  'Law Firm': ['Hartley & Partners', 'Mitchell Legal', 'Cornerstone Law', 'Ridgeline Attorneys', 'Sterling Legal'],
  'Real Estate': ['Horizon Realty', 'Metro Homes', 'KeyStone Properties', 'Urban Nest', 'Premier Listings'],
  Restaurant: ['Fire & Vine', 'The Local Table', 'Harbor Kitchen', 'Copper Spoon'],
  Plumber: ['FlowRight', 'Clear Pipe', 'Apex Plumbing', 'Quick Fix Plumbing'],
  Chiropractor: ['Align Wellness', 'Spine & Sport', 'Balance Chiropractic', 'Restore Health'],
}

const STREET_TYPES = ['St', 'Ave', 'Blvd', 'Dr', 'Way', 'Rd']

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h)
}

function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index * 9999) * 10000
  return x - Math.floor(x)
}

export function normalizeIndustry(input: string): string {
  const key = input.trim().toLowerCase()
  return INDUSTRY_ALIASES[key] ?? input.trim().replace(/\b\w/g, (c) => c.toUpperCase())
}

export function parseSearchQuery(industry: string, location: string) {
  const ind = normalizeIndustry(industry)
  const loc = location.trim() || 'Your Area'
  return { industry: ind, location: loc, seed: hashSeed(`${ind}-${loc}`.toLowerCase()) }
}

function generateOneBusiness(
  industry: string,
  location: string,
  serviceType: string,
  seed: number,
  index: number
): LocalBusiness {
  const prefixes = NAME_PREFIXES[industry] ?? ['Local', 'Premier', 'Main Street']
  const prefix = prefixes[Math.floor(seededRandom(seed, index) * prefixes.length)]
  const suffixes = ['LLC', 'Group', 'Co.', 'Studio', 'Center', 'Clinic', '']
  const suffix = suffixes[Math.floor(seededRandom(seed, index + 7) * suffixes.length)]
  const name = `${prefix} ${suffix}`.replace(/\s+/g, ' ').trim()

  const r = (offset: number) => seededRandom(seed, index + offset)

  const websiteExists = r(1) > 0.22
  const instagramExists = r(2) > 0.18
  const facebookExists = r(3) > 0.12
  const googleRating = Math.round((3.2 + r(4) * 1.6) * 10) / 10
  const reviewCount = Math.floor(8 + r(5) * 340)
  const activeGrowth = r(6) > 0.55 && reviewCount > 60

  const footprint = analyzeDigitalPresence({
    websiteExists,
    websiteQualityScore: websiteExists ? Math.floor(20 + r(10) * 75) : 0,
    instagramExists,
    instagramActivityScore: instagramExists ? Math.floor(10 + r(11) * 85) : 0,
    facebookExists,
    facebookActivityScore: facebookExists ? Math.floor(8 + r(12) * 80) : 0,
    brandingScore: Math.floor(25 + r(13) * 70),
    consistencyScore: Math.floor(20 + r(14) * 75),
    googleRating,
    reviewCount,
  })

  const streetNum = Math.floor(100 + r(15) * 8900)
  const street = STREET_TYPES[Math.floor(r(16) * STREET_TYPES.length)]
  const distance = `${(0.4 + r(17) * 8.2).toFixed(1)} mi`

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return buildLocalBusiness({
    id: `lb-mock-${seed}-${index}`,
    name,
    industry,
    location,
    address: `${streetNum} ${['Main', 'Oak', 'Market', 'Center', 'Park'][Math.floor(r(18) * 5)]} ${street}, ${location}`,
    googleRating,
    reviewCount,
    footprint,
    logo: initials.slice(0, 2),
    distance,
    lastUpdated: new Date().toISOString(),
    activeGrowth,
    dataSource: 'mock',
    serviceType: serviceType || 'marketing',
    phone: `(${Math.floor(200 + r(19) * 799)}) ${Math.floor(100 + r(20) * 899)}-${Math.floor(1000 + r(21) * 8999)}`,
    websiteUrl: websiteExists ? `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com` : null,
  })
}

export function parseNaturalQuery(query: string): { industry: string; location: string } | null {
  const trimmed = query.trim()
  const match = trimmed.match(/^(.+?)\s+in\s+(.+)$/i)
  if (match) {
    return { industry: match[1].trim(), location: match[2].trim() }
  }
  return null
}

export function generateMockBusinesses(industry: string, location: string, serviceType = ''): LocalBusiness[] {
  const { industry: ind, location: loc, seed } = parseSearchQuery(industry, location)
  const count = 10 + (seed % 4)
  return Array.from({ length: count }, (_, i) => generateOneBusiness(ind, loc, serviceType, seed, i)).sort(
    (a, b) => b.fitScore - a.fitScore
  )
}
