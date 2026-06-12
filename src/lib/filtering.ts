import type { Opportunity, UserProfile } from '../types';
import { DURATIONS } from '../data/vocab';
import { COUNTRIES } from '../data/countries';
import { isOpen, monthOf, compareMonth } from './dates';
import { isEligible, lensPasses, matchesInterests } from './eligibility';

export type SortKey = 'soonest' | 'latest' | 'recent';
export type ViewKey = 'gallery' | 'list' | 'map';

export interface Filters {
  q: string;
  types: string[];
  modes: string[];
  region: string | null;
  countries: string[];
  cities: string[];
  funding: string[];
  sectors: string[];
  durMin: number;
  durMax: number;
  openMode: 'open' | 'all';
  dueFrom: string | null; // 'YYYY-MM'
  dueTo: string | null;
  progFrom: string | null;
  progTo: string | null;
  includeUndated: boolean;
  sort: SortKey;
  savedOnly: boolean;
  matchProfile: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  q: '',
  types: [],
  modes: [],
  region: null,
  countries: [],
  cities: [],
  funding: [],
  sectors: [],
  durMin: 0,
  durMax: DURATIONS.length - 1,
  openMode: 'open',
  dueFrom: null,
  dueTo: null,
  progFrom: null,
  progTo: null,
  includeUndated: true,
  sort: 'soonest',
  savedOnly: false,
  matchProfile: false,
};

export function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.types.length) n++;
  if (f.modes.length) n++;
  if (f.region) n++;
  if (f.countries.length) n++;
  if (f.cities.length) n++;
  if (f.funding.length) n++;
  if (f.sectors.length) n++;
  if (f.durMin > 0 || f.durMax < DURATIONS.length - 1) n++;
  if (f.openMode === 'all') n++;
  if (f.dueFrom || f.dueTo) n++;
  if (f.progFrom || f.progTo) n++;
  if (!f.includeUndated) n++;
  if (f.savedOnly) n++;
  if (f.matchProfile) n++;
  return n;
}

const countryEnByCode = new Map(COUNTRIES.map((c) => [c.code, c.en.toLowerCase()]));
const countryZhByCode = new Map(COUNTRIES.map((c) => [c.code, c.zh]));

function textMatches(opp: Opportunity, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay: string[] = [
    opp.name.toLowerCase(),
    (opp.host ?? '').toLowerCase(),
    ...opp.cities.map((c) => c.toLowerCase()),
    ...opp.countries.map((c) => countryEnByCode.get(c) ?? c.toLowerCase()),
    ...opp.countries.map((c) => countryZhByCode.get(c) ?? ''),
    ...opp.sectors.map((s) => s.toLowerCase()),
    ...opp.types.map((t) => t.toLowerCase()),
    opp.region.toLowerCase(),
    opp.summary.en.toLowerCase(),
    opp.summary.zh,
  ];
  return hay.some((h) => h.includes(needle));
}

function durationMatches(opp: Opportunity, durMin: number, durMax: number): boolean {
  if (durMin === 0 && durMax === DURATIONS.length - 1) return true;
  return opp.durations.some((d) => {
    const i = DURATIONS.indexOf(d);
    return i >= durMin && i <= durMax;
  });
}

function dueWindowMatches(opp: Opportunity, from: string | null, to: string | null): boolean {
  if (!from && !to) return true;
  if (!opp.deadline) return false; // rolling has no due month
  const m = monthOf(opp.deadline);
  if (from && compareMonth(m, from) < 0) return false;
  if (to && compareMonth(m, to) > 0) return false;
  return true;
}

/**
 * Program-dates window: lower bound = starts on/after that month;
 * upper bound = finishes before the month after the stop.
 * Single-date programs use start as finish. Undated programs are
 * governed by the includeUndated toggle.
 */
function programWindowMatches(
  opp: Opportunity,
  from: string | null,
  to: string | null,
  includeUndated: boolean,
): boolean {
  if (!opp.start) {
    if (!includeUndated) return false;
    return true;
  }
  const startM = monthOf(opp.start);
  const endM = opp.end ? monthOf(opp.end) : startM;
  if (from && compareMonth(startM, from) < 0) return false;
  if (to && compareMonth(endM, to) > 0) return false;
  return true;
}

export interface FilterContext {
  saved: Set<string>;
  lens: string[];
  profile: UserProfile | null;
  profileComplete: boolean;
}

export function applyFilters(all: Opportunity[], f: Filters, ctx: FilterContext): Opportunity[] {
  let out = all.filter((opp) => {
    if (!textMatches(opp, f.q)) return false;
    if (f.types.length && !opp.types.some((t) => f.types.includes(t))) return false;
    if (f.modes.length && !opp.modes.some((m) => f.modes.includes(m))) return false;

    // Location cascade. When Remote is the only selected mode, location is irrelevant.
    const remoteOnly = f.modes.length === 1 && f.modes[0] === 'Remote';
    if (!remoteOnly) {
      if (f.region && opp.region !== f.region) return false;
      if (f.countries.length && !opp.countries.some((c) => f.countries.includes(c))) return false;
      if (f.cities.length && !opp.cities.some((c) => f.cities.includes(c))) return false;
    }

    if (f.funding.length && !opp.funding.some((x) => f.funding.includes(x))) return false;
    if (f.sectors.length && !opp.sectors.some((s) => f.sectors.includes(s))) return false;
    if (!durationMatches(opp, f.durMin, f.durMax)) return false;

    if (f.openMode === 'open' && !isOpen(opp.deadline)) return false;
    if (f.openMode === 'all' && !dueWindowMatches(opp, f.dueFrom, f.dueTo)) return false;
    if (!programWindowMatches(opp, f.progFrom, f.progTo, f.includeUndated)) return false;

    if (f.savedOnly && !ctx.saved.has(opp.id)) return false;
    if (!lensPasses(opp, ctx.lens)) return false;

    if (f.matchProfile && ctx.profile && ctx.profileComplete) {
      if (!isEligible(opp, ctx.profile)) return false;
      if (!matchesInterests(opp, ctx.profile)) return false;
    }
    return true;
  });

  out = sortOpportunities(out, f.sort);
  return out;
}

export function sortOpportunities(list: Opportunity[], sort: SortKey): Opportunity[] {
  const copy = [...list];
  switch (sort) {
    case 'soonest':
      // Open deadlines first (soonest first), then rolling, then closed (most recent first).
      copy.sort((a, b) => {
        const ao = isOpen(a.deadline);
        const bo = isOpen(b.deadline);
        const aRolling = !a.deadline;
        const bRolling = !b.deadline;
        const rank = (open: boolean, rolling: boolean) => (open && !rolling ? 0 : rolling ? 1 : 2);
        const ra = rank(ao, aRolling);
        const rb = rank(bo, bRolling);
        if (ra !== rb) return ra - rb;
        if (ra === 0) return a.deadline!.localeCompare(b.deadline!);
        if (ra === 2) return b.deadline!.localeCompare(a.deadline!);
        return a.name.localeCompare(b.name);
      });
      break;
    case 'latest':
      copy.sort((a, b) => {
        const aRolling = !a.deadline;
        const bRolling = !b.deadline;
        if (aRolling && bRolling) return a.name.localeCompare(b.name);
        if (aRolling) return -1; // rolling = no end, treat as "latest of all"
        if (bRolling) return 1;
        return b.deadline!.localeCompare(a.deadline!);
      });
      break;
    case 'recent':
      copy.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      break;
  }
  return copy;
}

/** Cascading location options derived from the records themselves. */
export function availableCountries(all: Opportunity[], region: string | null): string[] {
  const set = new Set<string>();
  for (const o of all) {
    if (region && o.region !== region) continue;
    for (const c of o.countries) set.add(c);
  }
  return [...set];
}

export function availableCities(all: Opportunity[], region: string | null, countries: string[]): string[] {
  const set = new Set<string>();
  for (const o of all) {
    if (region && o.region !== region) continue;
    if (countries.length && !o.countries.some((c) => countries.includes(c))) continue;
    for (const c of o.cities) set.add(c);
  }
  return [...set].sort();
}
