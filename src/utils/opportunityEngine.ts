import type {
  ContactChannelVisibility,
  ContactMethod,
  DigitalFootprint,
  LocalBusiness,
  OpportunityCategory,
  BusinessMaturity,
  DifficultyToClose,
} from "../types";
import { presenceWeaknesses } from "./digitalPresence";

export function calculateOpportunityScore(
  footprint: DigitalFootprint,
  rating: number,
  reviewCount: number,
): number {
  let score = 50;

  if (!footprint.websiteExists) score += 22;
  else if (footprint.websiteQualityScore < 40) score += 14;
  else if (footprint.websiteQualityScore > 75) score -= 12;

  if (footprint.mobileFriendlinessScore < 40 && footprint.websiteExists)
    score += 8;

  if (!footprint.instagramExists) score += 10;
  else if (footprint.instagramActivityScore < 35) score += 12;
  else if (footprint.instagramActivityScore > 70) score -= 8;

  if (!footprint.facebookExists) score += 6;
  else if (footprint.facebookActivityScore < 30) score += 8;

  if (footprint.brandingScore < 40) score += 10;
  if (footprint.consistencyScore < 40) score += 8;
  if (footprint.digitalPresenceStrength < 35) score += 12;
  if (footprint.digitalPresenceStrength > 70) score -= 15;

  if (
    rating >= 4.6 &&
    reviewCount > 100 &&
    footprint.digitalPresenceStrength < 50
  )
    score += 8;
  if (rating < 3.8) score += 6;
  if (reviewCount < 25) score += 5;

  if (footprint.growthIntent > 65) score += 6;

  return Math.min(98, Math.max(12, Math.round(score)));
}

export function deriveOpportunityCategories(
  score: number,
  footprint: DigitalFootprint,
  rating: number,
  activeGrowth: boolean,
): OpportunityCategory[] {
  const cats: OpportunityCategory[] = [];

  if (score >= 75) cats.push("high_potential");
  if (footprint.digitalPresenceStrength < 42 || !footprint.websiteExists) {
    cats.push("weak_digital_presence");
  }
  if (
    footprint.websiteQualityScore < 50 ||
    footprint.brandingScore < 45 ||
    footprint.consistencyScore < 45
  ) {
    cats.push("under_optimized");
  }
  if (activeGrowth || footprint.growthIntent >= 70) cats.push("scaling_fast");
  if (footprint.digitalPresenceStrength > 72 && rating >= 4.5)
    cats.push("strong_competitor");
  if (
    (!footprint.instagramExists || footprint.instagramActivityScore < 40) &&
    score >= 55
  ) {
    cats.push("needs_automation");
  }

  if (cats.length === 0)
    cats.push(score >= 50 ? "under_optimized" : "strong_competitor");

  return [...new Set(cats)].slice(0, 3);
}

export function primaryCategory(
  categories: OpportunityCategory[],
): OpportunityCategory {
  const priority: OpportunityCategory[] = [
    "high_potential",
    "weak_digital_presence",
    "under_optimized",
    "needs_automation",
    "scaling_fast",
    "strong_competitor",
  ];
  for (const p of priority) {
    if (categories.includes(p)) return p;
  }
  return categories[0];
}

export function deriveBusinessMaturity(
  reviewCount: number,
  rating: number,
  footprint: DigitalFootprint,
): BusinessMaturity {
  if (reviewCount > 200 && rating >= 4.5 && footprint.marketingMaturity > 65)
    return "mature";
  if (reviewCount > 80 || footprint.growthIntent > 60) return "established";
  if (reviewCount > 30) return "growing";
  return "early";
}

/* ── Revenue impact estimates by industry ──────────────────────────────── */
const REVENUE_RANGES: Record<
  string,
  { noSite: string; outdated: string; modernize: string }
> = {
  Dentist: {
    noSite: "$5,000–$10,000",
    outdated: "$3,500–$7,000",
    modernize: "$2,500–$5,000",
  },
  HVAC: {
    noSite: "$3,000–$6,000",
    outdated: "$2,500–$5,000",
    modernize: "$2,000–$4,000",
  },
  Roofing: {
    noSite: "$2,500–$5,000",
    outdated: "$2,000–$4,500",
    modernize: "$1,800–$3,500",
  },
  Plumber: {
    noSite: "$2,500–$5,000",
    outdated: "$2,000–$4,000",
    modernize: "$1,800–$3,500",
  },
  Chiropractor: {
    noSite: "$4,000–$8,000",
    outdated: "$3,000–$6,500",
    modernize: "$2,500–$5,000",
  },
  Landscaping: {
    noSite: "$2,000–$4,500",
    outdated: "$1,800–$4,000",
    modernize: "$1,500–$3,000",
  },
  "Pest Control": {
    noSite: "$2,000–$4,000",
    outdated: "$1,800–$3,500",
    modernize: "$1,500–$3,000",
  },
  "Med Spa": {
    noSite: "$6,000–$15,000",
    outdated: "$4,500–$10,000",
    modernize: "$3,500–$8,000",
  },
};

/* ── Industry-specific pitch angles ───────────────────────────────────── */
function getWebsitePitchAngle(
  name: string,
  industry: string,
  footprint: DigitalFootprint,
  rating: number,
  reviewCount: number,
): string {
  const ind = industry;
  const stars = `${rating}★ (${reviewCount} reviews)`;

  if (!footprint.websiteExists) {
    const angles: Record<string, string> = {
      Dentist: `${name} has ${stars} but no website — patients searching for a dentist can't find or book them online. A modern site with online booking could add 10–20 new patients/month.`,
      HVAC: `Homeowners with a broken furnace search Google first. ${name} has no website — every emergency call that could've been theirs is going to a competitor with a site.`,
      Roofing: `Storm season drives a wave of urgent roofing searches. ${name} has ${stars} but no website to capture them — every lead goes to someone who does.`,
      Plumber: `Emergency plumbing calls happen fast. ${name} has no online presence — anyone searching 'plumber near me' can't find them, costing them calls every single day.`,
      Chiropractor: `Patients research and compare before booking a chiropractor. ${name} has ${stars} but no site — that's trust left on the table and appointments going elsewhere.`,
      Landscaping: `Homeowners looking for landscaping start on Google. ${name} has no website — their ${stars} reputation is invisible online, and their competitors are capturing the leads.`,
      "Pest Control": `Pest problems are urgent. ${name} has no website — when someone searches 'pest control near me' at 10pm, a competitor with a fast, clear site gets the call.`,
      "Med Spa": `Med spa clients expect a luxury experience before they even walk in. ${name} has no website — that's an immediate credibility gap vs. competitors with polished online presence.`,
    };
    return (
      angles[ind] ??
      `${name} has strong local reviews (${stars}) but no website — every Google search for ${ind.toLowerCase()} in their area sends potential clients elsewhere.`
    );
  }

  if (footprint.websiteQualityScore < 45) {
    const angles: Record<string, string> = {
      Dentist: `${name} has ${stars} — that reputation deserves a website that converts visitors into booked appointments, not a dated site that makes them doubt the quality of care.`,
      HVAC: `${name}'s current website doesn't instill confidence when a homeowner is in a stressful situation. A fast, professional site with clear services and click-to-call wins more jobs.`,
      Roofing: `${name} has ${stars} but a weak website. In a market where homeowners compare 3 roofers, a polished site with project photos and reviews can win the bid.`,
      Plumber: `${name}'s site doesn't match the trust their ${stars} implies. A modern site with emergency service callouts and click-to-call converts more of their Google traffic.`,
      Chiropractor: `${name} has ${stars} but a website that undersells them. A professional site with team photos, patient testimonials, and online scheduling would significantly increase new patient flow.`,
      Landscaping: `${name}'s website quality score is low. Before/after galleries and a clear 'Get a Quote' flow on a modern site would convert more local homeowners searching for landscaping.`,
      "Pest Control": `${name} has an outdated site. A clean, fast redesign with service guarantees, pricing tiers, and a 'Book Today' CTA converts urgency-driven visitors into paying customers.`,
      "Med Spa": `${name} offers premium services but their website signals the opposite. A high-end redesign aligned with their brand would attract higher-value clients and justify premium pricing.`,
    };
    return (
      angles[ind] ??
      `${name}'s existing website (quality: ${footprint.websiteQualityScore}/100) is actively losing clients to competitors with more professional online presence.`
    );
  }

  if (footprint.mobileFriendlinessScore < 45) {
    return `${name} has a website but it's not mobile-friendly — and over 70% of local searches happen on phones. A mobile-optimized redesign could immediately recover lost traffic and conversions.`;
  }

  return `${name} has a functional website but it's not converting at its potential. UX improvements, faster load times, and a stronger call-to-action structure could measurably increase lead volume.`;
}

function getRevenueImpact(
  industry: string,
  footprint: DigitalFootprint,
): string {
  const ranges = REVENUE_RANGES[industry] ?? {
    noSite: "$2,500–$6,000",
    outdated: "$2,000–$4,500",
    modernize: "$1,500–$3,500",
  };
  if (!footprint.websiteExists) return `${ranges.noSite} website build project`;
  if (footprint.websiteQualityScore < 45)
    return `${ranges.outdated} website redesign project`;
  return `${ranges.modernize} website modernization project`;
}

function getDifficultyToClose(footprint: DigitalFootprint): DifficultyToClose {
  if (!footprint.websiteExists) return "easy";
  if (footprint.websiteQualityScore < 40) return "easy";
  if (footprint.websiteQualityScore < 65) return "medium";
  return "hard";
}

function getSocialActivityScore(footprint: DigitalFootprint): number {
  const ig = footprint.instagramExists ? footprint.instagramActivityScore : 0;
  const fb = footprint.facebookExists ? footprint.facebookActivityScore : 0;
  const count =
    Number(footprint.instagramExists) + Number(footprint.facebookExists);
  if (count === 0) return 0;
  return Math.round((ig + fb) / count);
}

/* ── Outreach intelligence ─────────────────────────────────────────────── */
export function generateOutreachIntelligence(
  name: string,
  industry: string,
  footprint: DigitalFootprint,
  weaknesses: string[],
  rating: number,
  reviewCount: number,
  opportunityScore: number,
): Pick<
  LocalBusiness,
  | "aiSummary"
  | "outreachAngle"
  | "outreachRecommendation"
  | "outreachOpener"
  | "serviceSuggestion"
  | "painPoint"
  | "suggestedServicePitch"
> {
  const topWeak = weaknesses[0] ?? "limited digital footprint";
  const industryLabel = industry.toLowerCase();

  const painPoint = !footprint.websiteExists
    ? "Potential clients cannot find, vet, or contact them online — every Google search for their service goes to a competitor with a website"
    : footprint.websiteQualityScore < 45
      ? "Their existing website is driving visitors away rather than converting them into customers"
      : footprint.mobileFriendlinessScore < 45
        ? "Over 70% of local searches are on mobile — their non-responsive site is losing those leads"
        : "Website is not optimized for lead conversion — visitors leave without taking action";

  const serviceSuggestion = !footprint.websiteExists
    ? "Full website build + local SEO setup"
    : footprint.websiteQualityScore < 45
      ? "Website redesign + conversion optimization"
      : footprint.mobileFriendlinessScore < 45
        ? "Mobile-first redesign + speed optimization"
        : "Conversion rate optimization + UX refresh";

  const outreachOpener =
    rating >= 4.5 && reviewCount > 50
      ? `Hi — I came across ${name} on Google and noticed your ${rating}★ rating with ${reviewCount}+ reviews. That kind of reputation deserves a website that actually converts visitors into booked ${industryLabel} appointments.`
      : `Hi — I've been researching ${industryLabel} businesses in your area and came across ${name}. I noticed an opportunity to help you capture more leads online that you might be missing right now.`;

  const outreachAngle = !footprint.websiteExists
    ? `${name} is invisible online — turn their strong reputation into a website that generates daily leads`
    : opportunityScore >= 75
      ? `${name}'s local reputation isn't translating to online revenue — a new site fixes that`
      : `Close the gap between offline success and online lead generation for ${name}`;

  const aiSummary = !footprint.websiteExists
    ? `${name} is a ${industryLabel} with ${rating}★ (${reviewCount} reviews) and zero web presence. Every Google search for ${industryLabel} in their area goes to a competitor with a website. High-priority prospect for a full website build. Opportunity score: ${opportunityScore}/100.`
    : `${name} is a ${industryLabel} with ${rating}★ and a website quality score of ${footprint.websiteQualityScore}/100. ${topWeak}. ${opportunityScore >= 65 ? "Strong fit for a website redesign — good timing before a competitor upgrades first." : "Moderate fit — position around conversion gains rather than starting from scratch."}`;

  const outreachRecommendation = `Lead with: "${outreachOpener}" Offer a free website audit highlighting ${painPoint.toLowerCase()}. Pitch a ${serviceSuggestion.toLowerCase()} with a concrete ROI frame (e.g. "3 more booked ${industryLabel} appointments/week pays for the site in a month").`;

  const suggestedServicePitch = `We build websites for ${industryLabel} businesses that generate real leads — not just brochure sites. For a ${industryLabel} with ${reviewCount} reviews like ${name}, a professional site typically adds 8–15 new client inquiries per month from Google alone.`;

  return {
    aiSummary,
    outreachAngle,
    outreachRecommendation,
    outreachOpener,
    serviceSuggestion,
    painPoint,
    suggestedServicePitch,
  };
}

/* ── Fit / Website Opportunity Score ───────────────────────────────────── */
export function generateFitAnalysis(
  name: string,
  _industry: string,
  footprint: DigitalFootprint,
  _serviceType: string,
  opportunityScore: number,
  rating: number,
  reviewCount: number,
): { fitScore: number; fitExplanation: string } {
  let fitScore = Math.round(opportunityScore * 0.6 + 20);

  let explanation: string;

  if (!footprint.websiteExists) {
    fitScore = Math.min(98, fitScore + 22);
    explanation = `${name} has no website — a complete blank-slate opportunity. With ${reviewCount} Google reviews and a ${rating}★ rating, the offline reputation is already proven. A professional site targeting local search could immediately convert online traffic into booked appointments. This is the easiest pitch: they need a site, full stop.`;
  } else if (footprint.websiteQualityScore < 35) {
    fitScore = Math.min(98, fitScore + 18);
    explanation = `${name} has a severely outdated website (quality: ${footprint.websiteQualityScore}/100). The site is likely slow, not mobile-friendly, and not converting visitors. With ${reviewCount} reviews and ${rating}★, the business has earned trust — their website is actively undercutting it. A redesign is a straightforward ROI pitch.`;
  } else if (footprint.websiteQualityScore < 55) {
    fitScore = Math.min(98, fitScore + 12);
    explanation = `${name} has a below-average website (quality: ${footprint.websiteQualityScore}/100). It exists, but it's not doing the job — weak mobile experience, poor conversion flow, or dated design. They have the reviews (${reviewCount}) to justify a premium digital presence. A redesign pitch around lead generation ROI is the angle.`;
  } else if (footprint.mobileFriendlinessScore < 40) {
    fitScore = Math.min(98, fitScore + 10);
    explanation = `${name} has a passable website but poor mobile experience (mobile score: ${footprint.mobileFriendlinessScore}/100). Most local searches happen on phones — they're losing leads every day. A mobile-first redesign is a concrete, specific pitch with measurable impact.`;
  } else if (footprint.websiteQualityScore > 72) {
    fitScore = Math.max(18, fitScore - 18);
    explanation = `${name} already has a strong website (quality: ${footprint.websiteQualityScore}/100). A redesign pitch will be difficult — they likely invested recently. Consider positioning around niche improvements like booking flow, speed optimization, or local SEO rather than a full rebuild.`;
  } else {
    fitScore = Math.min(98, fitScore + 4);
    explanation = `${name} has a mid-range website (quality: ${footprint.websiteQualityScore}/100). There's room to improve, but it's not an obvious pain point. A strong pitch would focus on specific conversion issues — call-to-action placement, load speed, or local keyword optimization — rather than a full redesign.`;
  }

  fitScore = Math.min(98, Math.max(12, Math.round(fitScore)));
  return { fitScore, fitExplanation: explanation };
}

export function generateContactChannelVisibility(
  footprint: DigitalFootprint,
  hasPhone: boolean,
): ContactChannelVisibility {
  return {
    instagram: footprint.instagramExists ? footprint.instagramActivityScore : 0,
    facebook: footprint.facebookExists ? footprint.facebookActivityScore : 0,
    phone: hasPhone ? Math.round(65 + footprint.reviewQualityScore * 0.2) : 0,
    website_form: footprint.websiteExists
      ? Math.round(footprint.websiteQualityScore * 0.75)
      : 0,
    email: footprint.websiteExists
      ? Math.round(30 + footprint.consistencyScore * 0.3)
      : 10,
  };
}

export function determineBestContactMethod(
  footprint: DigitalFootprint,
  hasPhone: boolean,
): { method: ContactMethod; reason: string } {
  if (footprint.instagramExists && footprint.instagramActivityScore > 55) {
    return {
      method: "instagram",
      reason: `Instagram is the best outreach channel — the business actively posts with a ${footprint.instagramActivityScore}/100 activity score. DMs are likely seen by the owner directly.`,
    };
  }

  if (hasPhone) {
    return {
      method: "phone",
      reason: `Direct phone call is recommended. Local trade businesses and service providers typically answer their phones — a short, specific call about their website opportunity is the fastest path to a conversation.`,
    };
  }

  if (footprint.websiteExists && footprint.websiteQualityScore > 40) {
    return {
      method: "website_form",
      reason: `Their website has a contact form. Reaching out via the form is professional and signals you researched them specifically — good for a value-led website pitch.`,
    };
  }

  if (footprint.facebookExists && footprint.facebookActivityScore > 30) {
    return {
      method: "facebook",
      reason: `Facebook is their most active channel (activity: ${footprint.facebookActivityScore}/100). Business messaging on Facebook often reaches the owner directly.`,
    };
  }

  return {
    method: "email",
    reason: `Email outreach is the most practical option. Keep it short — one specific observation about their website gap, one concrete outcome, one CTA.`,
  };
}

export function buildLocalBusiness(
  partial: Omit<
    LocalBusiness,
    | "opportunityScore"
    | "opportunityCategory"
    | "categories"
    | "weaknesses"
    | "outreachOpener"
    | "serviceSuggestion"
    | "painPoint"
    | "businessMaturity"
    | "outreachAngle"
    | "aiSummary"
    | "outreachRecommendation"
    | "suggestedServicePitch"
    | "fitScore"
    | "websiteOpportunityScore"
    | "fitExplanation"
    | "bestContactMethod"
    | "bestContactMethodReason"
    | "contactChannelVisibility"
    | "socialActivityScore"
    | "leadOpportunityScore"
    | "whyTheyNeedWebsite"
    | "revenueImpact"
    | "websitePitchAngle"
    | "difficultyToClose"
  >,
): LocalBusiness {
  const weaknesses = presenceWeaknesses(partial.footprint);
  const opportunityScore = calculateOpportunityScore(
    partial.footprint,
    partial.googleRating,
    partial.reviewCount,
  );
  const categories = deriveOpportunityCategories(
    opportunityScore,
    partial.footprint,
    partial.googleRating,
    partial.activeGrowth,
  );
  const outreach = generateOutreachIntelligence(
    partial.name,
    partial.industry,
    partial.footprint,
    weaknesses,
    partial.googleRating,
    partial.reviewCount,
    opportunityScore,
  );

  const { fitScore, fitExplanation } = generateFitAnalysis(
    partial.name,
    partial.industry,
    partial.footprint,
    partial.serviceType,
    opportunityScore,
    partial.googleRating,
    partial.reviewCount,
  );

  const { method: bestContactMethod, reason: bestContactMethodReason } =
    determineBestContactMethod(partial.footprint, Boolean(partial.phone));

  const contactChannelVisibility = generateContactChannelVisibility(
    partial.footprint,
    Boolean(partial.phone),
  );

  const socialActivityScore = getSocialActivityScore(partial.footprint);
  const whyTheyNeedWebsite = getWebsitePitchAngle(
    partial.name,
    partial.industry,
    partial.footprint,
    partial.googleRating,
    partial.reviewCount,
  );
  const revenueImpact = getRevenueImpact(partial.industry, partial.footprint);
  const websitePitchAngle = outreach.outreachAngle;
  const difficultyToClose = getDifficultyToClose(partial.footprint);

  return {
    ...partial,
    opportunityScore,
    opportunityCategory: primaryCategory(categories),
    categories,
    weaknesses,
    businessMaturity: deriveBusinessMaturity(
      partial.reviewCount,
      partial.googleRating,
      partial.footprint,
    ),
    ...outreach,
    fitScore,
    websiteOpportunityScore: fitScore,
    leadOpportunityScore: fitScore,
    fitExplanation,
    bestContactMethod,
    bestContactMethodReason,
    contactChannelVisibility,
    socialActivityScore,
    whyTheyNeedWebsite,
    revenueImpact,
    websitePitchAngle,
    difficultyToClose,
  };
}
