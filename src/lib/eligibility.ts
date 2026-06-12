import type { DegreeLevel, Opportunity, UserProfile } from '../types';

/**
 * Eligibility logic per the product spec (§5.3):
 * a user is eligible only if nationality, residency, degree AND experience all pass.
 */

/** Completed-degree ladder. Higher = more attained. */
const COMPLETED_RANK: Record<string, number> = {
  'High School': 1,
  Bachelor: 2,
  Master: 3,
  PhD: 4,
};

/**
 * Implied *completed* attainment for each possible user education level.
 * Someone "Master Enrolled" has completed a Bachelor, etc.
 */
function completedRankOf(level: DegreeLevel | undefined): number {
  switch (level) {
    case 'High School':
      return 1;
    case 'Bachelor Enrolled':
      return 1; // completed high school
    case 'Bachelor':
      return 2;
    case 'Master Enrolled':
      return 2; // completed bachelor
    case 'Master':
      return 3;
    case 'PhD Enrolled':
      return 3; // completed master
    case 'PhD':
      return 4;
    default:
      return 0;
  }
}

function degreePasses(requirement: DegreeLevel, userLevel: DegreeLevel): boolean {
  if (requirement === 'Open to all') return true;
  if (requirement.endsWith('Enrolled')) {
    // Enrolled stages must match exactly.
    return userLevel === requirement;
  }
  // Completed requirement: user's attained completed level must meet or exceed it.
  return completedRankOf(userLevel) >= (COMPLETED_RANK[requirement] ?? 99);
}

export function checkNationality(opp: Opportunity, nationality: string | undefined): boolean {
  if (opp.nationalities.length === 0) return true;
  if (!nationality) return false;
  return opp.nationalities.includes(nationality);
}

export function checkResidency(opp: Opportunity, residency: string | undefined): boolean {
  if (opp.residencies.length === 0) return true;
  if (!residency) return false;
  return opp.residencies.includes(residency);
}

export function checkDegree(opp: Opportunity, level: DegreeLevel | undefined): boolean {
  if (opp.degrees.length === 0 || opp.degrees.includes('Open to all')) return true;
  if (!level) return false;
  return opp.degrees.some((req) => degreePasses(req, level));
}

export function checkExperience(opp: Opportunity, years: number | undefined): boolean {
  switch (opp.experience) {
    case 'Open to all':
      return true;
    case '< 3 yrs':
      return years !== undefined && years < 3;
    case '> 3 yrs':
      return years !== undefined && years >= 3;
    case '> 5 yrs':
      return years !== undefined && years >= 5;
  }
}

export function isEligible(opp: Opportunity, profile: UserProfile): boolean {
  return (
    checkNationality(opp, profile.nationality) &&
    checkResidency(opp, profile.residency) &&
    checkDegree(opp, profile.education) &&
    checkExperience(opp, profile.experienceYears)
  );
}

/**
 * Nationality lens: passes when the opportunity is open, or any selected
 * nationality is explicitly included.
 */
export function lensPasses(opp: Opportunity, lens: string[]): boolean {
  if (lens.length === 0) return true;
  if (opp.nationalities.length === 0) return true;
  return lens.some((code) => opp.nationalities.includes(code));
}

/** Badged "Open to you": restrictions exist AND the lens passes them. */
export function isOpenToYou(opp: Opportunity, lens: string[]): boolean {
  return lens.length > 0 && opp.nationalities.length > 0 && lensPasses(opp, lens);
}

/** Interest match for "Match my profile" and recommendations. */
export function matchesInterests(opp: Opportunity, profile: UserProfile): boolean {
  const typeOk =
    profile.interestTypes.length === 0 || opp.types.some((t) => profile.interestTypes.includes(t));
  const sectorOk =
    profile.interestSectors.length === 0 ||
    opp.sectors.includes('All Fields') ||
    opp.sectors.some((s) => profile.interestSectors.includes(s));
  return typeOk && sectorOk;
}

/** Relevance score used to rank the dashboard feed. */
export function relevanceScore(opp: Opportunity, profile: UserProfile): number {
  let score = 0;
  for (const t of opp.types) if (profile.interestTypes.includes(t)) score += 2;
  for (const s of opp.sectors) if (profile.interestSectors.includes(s)) score += 1;
  if (opp.sectors.includes('All Fields') && profile.interestSectors.length > 0) score += 1;
  return score;
}

/** Profile completeness: identity + education fields gate matching. */
export interface ProfileChecklist {
  identity: boolean; // gender + nationality + residency
  education: boolean; // education level + experience years
  interests: boolean; // at least one interest dimension touched
  percent: number;
  complete: boolean;
}

export function profileChecklist(profile: UserProfile): ProfileChecklist {
  const identity = Boolean(profile.gender && profile.nationality && profile.residency);
  const education = Boolean(profile.education && profile.experienceYears !== undefined);
  const interests = profile.interestTypes.length > 0 || profile.interestSectors.length > 0;
  const parts = [
    profile.gender,
    profile.nationality,
    profile.residency,
    profile.education,
    profile.experienceYears !== undefined ? 'y' : undefined,
    interests ? 'y' : undefined,
  ];
  const filled = parts.filter(Boolean).length;
  const percent = Math.round((filled / parts.length) * 100);
  // "Complete" = required identity/education fields are filled (interests optional).
  const complete = identity && education;
  return { identity, education, interests, percent, complete };
}
