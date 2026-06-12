export interface Country {
  code: string;
  en: string;
  zh: string;
}

/**
 * Searchable country list used for the nationality lens, profile fields and
 * residency selection. Not exhaustive — a representative global set.
 */
export const COUNTRIES: Country[] = [
  { code: 'AF', en: 'Afghanistan', zh: '阿富汗' },
  { code: 'AR', en: 'Argentina', zh: '阿根廷' },
  { code: 'AM', en: 'Armenia', zh: '亚美尼亚' },
  { code: 'AU', en: 'Australia', zh: '澳大利亚' },
  { code: 'AT', en: 'Austria', zh: '奥地利' },
  { code: 'AZ', en: 'Azerbaijan', zh: '阿塞拜疆' },
  { code: 'BD', en: 'Bangladesh', zh: '孟加拉国' },
  { code: 'BE', en: 'Belgium', zh: '比利时' },
  { code: 'BJ', en: 'Benin', zh: '贝宁' },
  { code: 'BO', en: 'Bolivia', zh: '玻利维亚' },
  { code: 'BW', en: 'Botswana', zh: '博茨瓦纳' },
  { code: 'BR', en: 'Brazil', zh: '巴西' },
  { code: 'BG', en: 'Bulgaria', zh: '保加利亚' },
  { code: 'BF', en: 'Burkina Faso', zh: '布基纳法索' },
  { code: 'KH', en: 'Cambodia', zh: '柬埔寨' },
  { code: 'CM', en: 'Cameroon', zh: '喀麦隆' },
  { code: 'CA', en: 'Canada', zh: '加拿大' },
  { code: 'CL', en: 'Chile', zh: '智利' },
  { code: 'CN', en: 'China', zh: '中国' },
  { code: 'CO', en: 'Colombia', zh: '哥伦比亚' },
  { code: 'CR', en: 'Costa Rica', zh: '哥斯达黎加' },
  { code: 'HR', en: 'Croatia', zh: '克罗地亚' },
  { code: 'CZ', en: 'Czechia', zh: '捷克' },
  { code: 'DK', en: 'Denmark', zh: '丹麦' },
  { code: 'EC', en: 'Ecuador', zh: '厄瓜多尔' },
  { code: 'EG', en: 'Egypt', zh: '埃及' },
  { code: 'SV', en: 'El Salvador', zh: '萨尔瓦多' },
  { code: 'EE', en: 'Estonia', zh: '爱沙尼亚' },
  { code: 'ET', en: 'Ethiopia', zh: '埃塞俄比亚' },
  { code: 'FI', en: 'Finland', zh: '芬兰' },
  { code: 'FR', en: 'France', zh: '法国' },
  { code: 'GE', en: 'Georgia', zh: '格鲁吉亚' },
  { code: 'DE', en: 'Germany', zh: '德国' },
  { code: 'GH', en: 'Ghana', zh: '加纳' },
  { code: 'GR', en: 'Greece', zh: '希腊' },
  { code: 'GT', en: 'Guatemala', zh: '危地马拉' },
  { code: 'HN', en: 'Honduras', zh: '洪都拉斯' },
  { code: 'HK', en: 'Hong Kong SAR', zh: '中国香港' },
  { code: 'HU', en: 'Hungary', zh: '匈牙利' },
  { code: 'IS', en: 'Iceland', zh: '冰岛' },
  { code: 'IN', en: 'India', zh: '印度' },
  { code: 'ID', en: 'Indonesia', zh: '印度尼西亚' },
  { code: 'IR', en: 'Iran', zh: '伊朗' },
  { code: 'IQ', en: 'Iraq', zh: '伊拉克' },
  { code: 'IE', en: 'Ireland', zh: '爱尔兰' },
  { code: 'IL', en: 'Israel', zh: '以色列' },
  { code: 'IT', en: 'Italy', zh: '意大利' },
  { code: 'CI', en: "Côte d'Ivoire", zh: '科特迪瓦' },
  { code: 'JM', en: 'Jamaica', zh: '牙买加' },
  { code: 'JP', en: 'Japan', zh: '日本' },
  { code: 'JO', en: 'Jordan', zh: '约旦' },
  { code: 'KZ', en: 'Kazakhstan', zh: '哈萨克斯坦' },
  { code: 'KE', en: 'Kenya', zh: '肯尼亚' },
  { code: 'KR', en: 'South Korea', zh: '韩国' },
  { code: 'KG', en: 'Kyrgyzstan', zh: '吉尔吉斯斯坦' },
  { code: 'LA', en: 'Laos', zh: '老挝' },
  { code: 'LV', en: 'Latvia', zh: '拉脱维亚' },
  { code: 'LB', en: 'Lebanon', zh: '黎巴嫩' },
  { code: 'LS', en: 'Lesotho', zh: '莱索托' },
  { code: 'LR', en: 'Liberia', zh: '利比里亚' },
  { code: 'LT', en: 'Lithuania', zh: '立陶宛' },
  { code: 'MG', en: 'Madagascar', zh: '马达加斯加' },
  { code: 'MW', en: 'Malawi', zh: '马拉维' },
  { code: 'MY', en: 'Malaysia', zh: '马来西亚' },
  { code: 'ML', en: 'Mali', zh: '马里' },
  { code: 'MX', en: 'Mexico', zh: '墨西哥' },
  { code: 'MN', en: 'Mongolia', zh: '蒙古' },
  { code: 'MA', en: 'Morocco', zh: '摩洛哥' },
  { code: 'MZ', en: 'Mozambique', zh: '莫桑比克' },
  { code: 'MM', en: 'Myanmar', zh: '缅甸' },
  { code: 'NA', en: 'Namibia', zh: '纳米比亚' },
  { code: 'NP', en: 'Nepal', zh: '尼泊尔' },
  { code: 'NL', en: 'Netherlands', zh: '荷兰' },
  { code: 'NZ', en: 'New Zealand', zh: '新西兰' },
  { code: 'NI', en: 'Nicaragua', zh: '尼加拉瓜' },
  { code: 'NE', en: 'Niger', zh: '尼日尔' },
  { code: 'NG', en: 'Nigeria', zh: '尼日利亚' },
  { code: 'NO', en: 'Norway', zh: '挪威' },
  { code: 'PK', en: 'Pakistan', zh: '巴基斯坦' },
  { code: 'PS', en: 'Palestine', zh: '巴勒斯坦' },
  { code: 'PA', en: 'Panama', zh: '巴拿马' },
  { code: 'PG', en: 'Papua New Guinea', zh: '巴布亚新几内亚' },
  { code: 'PY', en: 'Paraguay', zh: '巴拉圭' },
  { code: 'PE', en: 'Peru', zh: '秘鲁' },
  { code: 'PH', en: 'Philippines', zh: '菲律宾' },
  { code: 'PL', en: 'Poland', zh: '波兰' },
  { code: 'PT', en: 'Portugal', zh: '葡萄牙' },
  { code: 'QA', en: 'Qatar', zh: '卡塔尔' },
  { code: 'RO', en: 'Romania', zh: '罗马尼亚' },
  { code: 'RU', en: 'Russia', zh: '俄罗斯' },
  { code: 'RW', en: 'Rwanda', zh: '卢旺达' },
  { code: 'SA', en: 'Saudi Arabia', zh: '沙特阿拉伯' },
  { code: 'SN', en: 'Senegal', zh: '塞内加尔' },
  { code: 'RS', en: 'Serbia', zh: '塞尔维亚' },
  { code: 'SL', en: 'Sierra Leone', zh: '塞拉利昂' },
  { code: 'SG', en: 'Singapore', zh: '新加坡' },
  { code: 'SK', en: 'Slovakia', zh: '斯洛伐克' },
  { code: 'SI', en: 'Slovenia', zh: '斯洛文尼亚' },
  { code: 'ZA', en: 'South Africa', zh: '南非' },
  { code: 'ES', en: 'Spain', zh: '西班牙' },
  { code: 'LK', en: 'Sri Lanka', zh: '斯里兰卡' },
  { code: 'SE', en: 'Sweden', zh: '瑞典' },
  { code: 'CH', en: 'Switzerland', zh: '瑞士' },
  { code: 'TW', en: 'Taiwan, China', zh: '中国台湾' },
  { code: 'TJ', en: 'Tajikistan', zh: '塔吉克斯坦' },
  { code: 'TZ', en: 'Tanzania', zh: '坦桑尼亚' },
  { code: 'TH', en: 'Thailand', zh: '泰国' },
  { code: 'TG', en: 'Togo', zh: '多哥' },
  { code: 'TN', en: 'Tunisia', zh: '突尼斯' },
  { code: 'TR', en: 'Türkiye', zh: '土耳其' },
  { code: 'UG', en: 'Uganda', zh: '乌干达' },
  { code: 'UA', en: 'Ukraine', zh: '乌克兰' },
  { code: 'AE', en: 'United Arab Emirates', zh: '阿联酋' },
  { code: 'GB', en: 'United Kingdom', zh: '英国' },
  { code: 'US', en: 'United States', zh: '美国' },
  { code: 'UY', en: 'Uruguay', zh: '乌拉圭' },
  { code: 'UZ', en: 'Uzbekistan', zh: '乌兹别克斯坦' },
  { code: 'VE', en: 'Venezuela', zh: '委内瑞拉' },
  { code: 'VN', en: 'Vietnam', zh: '越南' },
  { code: 'ZM', en: 'Zambia', zh: '赞比亚' },
  { code: 'ZW', en: 'Zimbabwe', zh: '津巴布韦' },
];

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));

export function countryName(code: string, lang: 'en' | 'zh'): string {
  const c = byCode.get(code);
  if (!c) return code;
  return lang === 'zh' ? c.zh : c.en;
}

export function searchCountries(query: string, lang: 'en' | 'zh'): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter(
    (c) =>
      c.en.toLowerCase().includes(q) || c.zh.includes(q) || c.code.toLowerCase() === q,
  );
}

/** Convenience groups used by fixtures. */
export const AFRICAN_COUNTRIES = ['BJ','BW','BF','CM','CI','EG','ET','GH','KE','LS','LR','MG','MW','ML','MA','MZ','NA','NE','NG','RW','SN','SL','ZA','TZ','TG','TN','UG','ZM','ZW'];
export const APAC_COUNTRIES = ['AU','BD','KH','CN','HK','IN','ID','JP','KZ','KR','KG','LA','MY','MN','MM','NP','NZ','PK','PG','PH','SG','LK','TW','TJ','TH','UZ','VN'];
export const LATAM_COUNTRIES = ['AR','BO','BR','CL','CO','CR','EC','SV','GT','HN','JM','MX','NI','PA','PY','PE','UY','VE'];
