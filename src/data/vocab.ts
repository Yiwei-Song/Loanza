import type {
  DegreeLevel,
  DeliveryMode,
  Duration,
  ExperienceLevel,
  Funding,
  ProgramType,
  Region,
  Sector,
} from '../types';

export const PROGRAM_TYPES: ProgramType[] = [
  'Fellowship',
  'Internship',
  'Professional Role',
  'Volunteering',
  'Entrepreneurship',
  'Course / Training',
  "Bachelor's Scholarship",
  "Master's Scholarship",
  'PhD Scholarship',
  'Research Program',
  'Summer School',
  'Winter School',
  'Forum / Summit',
  'Cultural Exchange',
];

export const DURATIONS: Duration[] = [
  'Days',
  '2-3 weeks',
  '1 month',
  '2 months',
  '3 months',
  '4 months',
  '5 months',
  '6 months',
  '7 months',
  '8 months',
  '9 months',
  '10 months',
  '11 months',
  '1 year',
  '2 years',
  '3 years',
  'Long term',
  'Flexible',
];

export const DELIVERY_MODES: DeliveryMode[] = ['In-person', 'Remote', 'Hybrid'];

export const REGIONS: Region[] = [
  'Global',
  'Asia',
  'Africa',
  'Australia / Oceania',
  'North America',
  'South America',
  'Europe',
];

export const FUNDING_TYPES: Funding[] = [
  'Self Funded',
  'Free',
  'Fully Funded',
  'Partial / Stipend',
  'Salary',
];

export const DEGREE_LEVELS: DegreeLevel[] = [
  'Open to all',
  'High School',
  'Bachelor',
  'Bachelor Enrolled',
  'Master',
  'Master Enrolled',
  'PhD',
  'PhD Enrolled',
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Open to all', '< 3 yrs', '> 3 yrs', '> 5 yrs'];

export const SECTORS: Sector[] = [
  'All Fields',
  'Technology & Computing',
  'Engineering',
  'Sciences & Mathematics',
  'Environment & Sustainability',
  'Health & Medicine',
  'Business & Management',
  'Economics & Finance',
  'Law & Human Rights',
  'Politics & Public Policy',
  'Social Impact & Development',
  'Education & Teaching',
  'Arts & Design',
  'Media & Communication',
  'Humanities',
  'Social Sciences',
  'Agriculture & Food',
];

/** Sectors offered as *personal interests* (All Fields is a property of opportunities only). */
export const INTEREST_SECTORS: Sector[] = SECTORS.filter((s) => s !== 'All Fields');

// ---------- Chinese translations of every vocabulary term ----------
const ZH: Record<string, string> = {
  // Program types
  Fellowship: '研修金项目',
  Internship: '实习',
  'Professional Role': '职业岗位',
  Volunteering: '志愿服务',
  Entrepreneurship: '创业项目',
  'Course / Training': '课程 / 培训',
  "Bachelor's Scholarship": '本科奖学金',
  "Master's Scholarship": '硕士奖学金',
  'PhD Scholarship': '博士奖学金',
  'Research Program': '科研项目',
  'Summer School': '夏校',
  'Winter School': '冬校',
  'Forum / Summit': '论坛 / 峰会',
  'Cultural Exchange': '文化交流',
  // Durations
  Days: '数天',
  '2-3 weeks': '2–3 周',
  '1 month': '1 个月',
  '2 months': '2 个月',
  '3 months': '3 个月',
  '4 months': '4 个月',
  '5 months': '5 个月',
  '6 months': '6 个月',
  '7 months': '7 个月',
  '8 months': '8 个月',
  '9 months': '9 个月',
  '10 months': '10 个月',
  '11 months': '11 个月',
  '1 year': '1 年',
  '2 years': '2 年',
  '3 years': '3 年',
  'Long term': '长期',
  Flexible: '灵活',
  // Modes
  'In-person': '线下',
  Remote: '远程',
  Hybrid: '混合',
  // Regions
  Global: '全球',
  Asia: '亚洲',
  Africa: '非洲',
  'Australia / Oceania': '澳洲 / 大洋洲',
  'North America': '北美洲',
  'South America': '南美洲',
  Europe: '欧洲',
  // Funding
  'Self Funded': '自费',
  Free: '免费',
  'Fully Funded': '全额资助',
  'Partial / Stipend': '部分资助 / 津贴',
  Salary: '带薪',
  // Degrees
  'Open to all': '不限',
  'High School': '高中',
  Bachelor: '本科毕业',
  'Bachelor Enrolled': '本科在读',
  Master: '硕士毕业',
  'Master Enrolled': '硕士在读',
  PhD: '博士毕业',
  'PhD Enrolled': '博士在读',
  // Experience
  '< 3 yrs': '3 年以下',
  '> 3 yrs': '3 年以上',
  '> 5 yrs': '5 年以上',
  // Sectors
  'All Fields': '不限领域',
  'Technology & Computing': '科技与计算机',
  Engineering: '工程',
  'Sciences & Mathematics': '科学与数学',
  'Environment & Sustainability': '环境与可持续发展',
  'Health & Medicine': '健康与医学',
  'Business & Management': '商业与管理',
  'Economics & Finance': '经济与金融',
  'Law & Human Rights': '法律与人权',
  'Politics & Public Policy': '政治与公共政策',
  'Social Impact & Development': '社会影响与发展',
  'Education & Teaching': '教育与教学',
  'Arts & Design': '艺术与设计',
  'Media & Communication': '媒体与传播',
  Humanities: '人文学科',
  'Social Sciences': '社会科学',
  'Agriculture & Food': '农业与食品',
  // Recurrence
  Random: '不定期',
  Annual: '每年一次',
  'Bi-Annual': '每年两次',
  Rolling: '滚动开放',
  Umbrella: '系列项目',
};

/** Translate a controlled-vocabulary term. Falls back to the English term. */
export function vocabZh(term: string): string {
  return ZH[term] ?? term;
}

export function tVocab(term: string, lang: 'en' | 'zh'): string {
  return lang === 'zh' ? vocabZh(term) : term;
}
