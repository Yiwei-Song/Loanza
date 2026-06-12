// ---------- Bilingual text ----------
export type Lang = 'en' | 'zh';
export interface Bi {
  en: string;
  zh: string;
}

// ---------- Controlled vocabularies ----------
export type ProgramType =
  | 'Fellowship'
  | 'Internship'
  | 'Professional Role'
  | 'Volunteering'
  | 'Entrepreneurship'
  | 'Course / Training'
  | "Bachelor's Scholarship"
  | "Master's Scholarship"
  | 'PhD Scholarship'
  | 'Research Program'
  | 'Summer School'
  | 'Winter School'
  | 'Forum / Summit'
  | 'Cultural Exchange';

export type Duration =
  | 'Days'
  | '2-3 weeks'
  | '1 month'
  | '2 months'
  | '3 months'
  | '4 months'
  | '5 months'
  | '6 months'
  | '7 months'
  | '8 months'
  | '9 months'
  | '10 months'
  | '11 months'
  | '1 year'
  | '2 years'
  | '3 years'
  | 'Long term'
  | 'Flexible';

export type DeliveryMode = 'In-person' | 'Remote' | 'Hybrid';

export type Region =
  | 'Global'
  | 'Asia'
  | 'Africa'
  | 'Australia / Oceania'
  | 'North America'
  | 'South America'
  | 'Europe';

export type Funding = 'Self Funded' | 'Free' | 'Fully Funded' | 'Partial / Stipend' | 'Salary';

export type DegreeLevel =
  | 'Open to all'
  | 'High School'
  | 'Bachelor'
  | 'Bachelor Enrolled'
  | 'Master'
  | 'Master Enrolled'
  | 'PhD'
  | 'PhD Enrolled';

export type ExperienceLevel = 'Open to all' | '< 3 yrs' | '> 3 yrs' | '> 5 yrs';

export type Sector =
  | 'All Fields'
  | 'Technology & Computing'
  | 'Engineering'
  | 'Sciences & Mathematics'
  | 'Environment & Sustainability'
  | 'Health & Medicine'
  | 'Business & Management'
  | 'Economics & Finance'
  | 'Law & Human Rights'
  | 'Politics & Public Policy'
  | 'Social Impact & Development'
  | 'Education & Teaching'
  | 'Arts & Design'
  | 'Media & Communication'
  | 'Humanities'
  | 'Social Sciences'
  | 'Agriculture & Food';

export type Recurrence = 'Random' | 'Annual' | 'Bi-Annual' | 'Rolling' | 'Umbrella';

// ---------- Opportunity ----------
export interface MapLocation {
  city: string;
  country: string; // country code
  lat: number;
  lon: number;
}

export interface TimelineEntry {
  label: Bi;
  date: Bi;
}

export interface OpportunityBody {
  summary?: Bi;
  benefits?: Bi[];
  eligibility?: Bi[];
  process?: Bi[];
  tips?: Bi;
  timeline?: TimelineEntry[];
}

export interface Opportunity {
  id: string;
  slug: string;
  name: string;
  host?: string;
  officialUrl?: string;
  /** ISO date; undefined = rolling */
  deadline?: string;
  /** ISO date; undefined = TBA / undated */
  start?: string;
  end?: string;
  recurrence?: Recurrence;
  types: ProgramType[];
  region: Region;
  /** country codes */
  countries: string[];
  cities: string[];
  locations: MapLocation[];
  modes: DeliveryMode[];
  durations: Duration[];
  /** empty = open to all */
  degrees: DegreeLevel[];
  experience: ExperienceLevel;
  /** country codes; empty = open to all */
  nationalities: string[];
  /** country codes; empty = open to all */
  residencies: string[];
  sectors: Sector[];
  funding: Funding[];
  summary: Bi;
  addedAt: string;
  body?: OpportunityBody;
}

// ---------- User / profile ----------
export interface UserProfile {
  gender?: 'female' | 'male' | 'nonbinary' | 'undisclosed';
  nationality?: string; // country code
  residency?: string; // country code
  education?: DegreeLevel;
  experienceYears?: number;
  /** empty array = "All" (don't narrow) */
  interestTypes: ProgramType[];
  interestSectors: Sector[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  member: boolean;
  profile: UserProfile;
  saved: string[];
  createdAt: string;
}

// ---------- Resources ----------
export interface ResourceArticle {
  id: string;
  slug: string;
  category: 'applications' | 'interviews' | 'essays' | 'networking' | 'funding' | 'mindset';
  title: Bi;
  excerpt: Bi;
  readMinutes: number;
  body: Bi[]; // paragraphs
}
