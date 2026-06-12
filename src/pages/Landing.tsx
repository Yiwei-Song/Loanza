import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { OPPORTUNITIES } from '../data/opportunities';
import { RESOURCES } from '../data/resources';
import { PROGRAM_TYPES } from '../data/vocab';
import { isClosingSoon, isOpen } from '../lib/dates';
import { lensPasses } from '../lib/eligibility';
import { useApp } from '../state/store';
import { BrowserFrame, CountUp, Delta, Icon, Logo, Reveal, TickBar } from '../components/ui';
import { MAP_H, MAP_W, MAP_Y0, projectMap, WorldDots } from '../components/mapview';
import { DeadlineChip } from '../components/opportunity';

const LENS_DEMO_NATIONS = ['CN', 'NG', 'IN', 'BR', 'DE'];
const LENS_DEMO_OPPS = ['chevening-2027', 'mastercard-toronto-2027', 'rhodes-2027', 'jet-2027', 'obama-apac-2026', 'schwarzman-2027'];

function project(lat: number, lon: number) {
  const { x, y } = projectMap(lat, lon);
  return { x: x / MAP_W, y: (y - MAP_Y0) / MAP_H };
}

export default function LandingPage() {
  const { t, tv, tb, lang } = useApp();

  const total = OPPORTUNITIES.length;
  const openNow = useMemo(() => OPPORTUNITIES.filter((o) => isOpen(o.deadline)).length, []);
  const closingSoon = useMemo(() => OPPORTUNITIES.filter((o) => isClosingSoon(o.deadline)).length, []);
  const cityCount = useMemo(() => {
    const set = new Set<string>();
    for (const o of OPPORTUNITIES) for (const l of o.locations) set.add(`${l.city}|${l.country}`);
    return set.size;
  }, []);

  const heroPins = useMemo(() => {
    const seen = new Set<string>();
    const pins: { x: number; y: number; key: string }[] = [];
    for (const o of OPPORTUNITIES) {
      for (const l of o.locations) {
        const key = `${l.city}|${l.country}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const { x, y } = project(l.lat, l.lon);
        pins.push({ x, y, key });
      }
    }
    return pins;
  }, []);

  const floatCards = useMemo(() => {
    const picks = ['schwarzman-2027', 'oyw-2026'];
    return OPPORTUNITIES.filter((o) => picks.includes(o.id));
  }, []);

  const recentlyDecoded = useMemo(
    () => [...OPPORTUNITIES].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).slice(0, 3),
    [],
  );

  // ── lens demo state ──
  const [demoNation, setDemoNation] = useState<string | null>(null);
  const demoOpps = useMemo(() => OPPORTUNITIES.filter((o) => LENS_DEMO_OPPS.includes(o.id)), []);
  const demoLens = demoNation ? [demoNation] : [];
  const demoOpen = demoOpps.filter((o) => lensPasses(o, demoLens)).length;

  const typeCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const ty of PROGRAM_TYPES) m.set(ty, 0);
    for (const o of OPPORTUNITIES) for (const ty of o.types) m.set(ty, (m.get(ty) ?? 0) + 1);
    return m;
  }, []);

  const teaserArticles = RESOURCES.slice(0, 3);

  return (
    <div className="landing">
      {/* ─────────── hero ─────────── */}
      <section className="hero">
        <div className="hero-swirl" aria-hidden="true">
          <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMin slice">
            <ellipse cx="700" cy="240" rx="560" ry="380" />
            <ellipse cx="700" cy="240" rx="760" ry="520" />
            <ellipse cx="700" cy="240" rx="980" ry="680" />
          </svg>
        </div>
        <div className="hero-inner">
          <Reveal>
            <span className="kicker">{t('landing.kicker')}</span>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="hero-title">
              {t('landing.title1')} <span className="dim">{t('landing.title2')}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="hero-sub">{t('landing.sub')}</p>
          </Reveal>
          <Reveal delay={180}>
            <div className="hero-ctas">
              <a href="#how" className="btn btn-outline">
                {t('landing.ctaSecondary')}
              </a>
              <Link to="/opportunities" className="btn btn-primary">
                {t('landing.ctaPrimary')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── the workspace mockup ── */}
        <Reveal delay={260} className="hero-map-reveal">
          <div className="hero-mock-wrap">
            <BrowserFrame url="circlebreaker.club/opportunities">
              <div className="ws">
                <div className="ws-head">
                  <span className="ws-brand">
                    <Logo size={20} />
                    <strong>{t('common.appName')}</strong>
                  </span>
                  <span className="ws-title">{t('db.title')}</span>
                  <span className="ws-head-right">
                    <span className="ws-pill">
                      {lang === 'zh' ? '本月' : 'This Month'}
                      <Icon name="chevronDown" size={11} strokeWidth={2.2} />
                    </span>
                    <span className="ws-avatar">A</span>
                  </span>
                </div>

                <div className="ws-stats">
                  <div className="ws-stat">
                    <span className="ws-stat-value num">
                      <CountUp value={total} />
                      <Delta value="+6" dir="up" />
                    </span>
                    <span className="ws-stat-label">{t('landing.metric.total')}</span>
                  </div>
                  <div className="ws-stat">
                    <span className="ws-stat-value num">
                      <CountUp value={openNow} />
                      <Delta value="+2" dir="up" />
                    </span>
                    <span className="ws-stat-label">{t('landing.metric.open')}</span>
                  </div>
                  <div className="ws-stat">
                    <span className="ws-stat-value num">
                      <CountUp value={closingSoon} />
                      <Delta value="-2" dir="down" />
                    </span>
                    <span className="ws-stat-label">{t('landing.metric.closing')}</span>
                  </div>
                </div>

                <div className="ws-grid">
                  <div className="ws-map">
                    <WorldDots className="hero-world" />
                    {heroPins.map((p, i) => (
                      <span
                        key={p.key}
                        className="hero-pin"
                        style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, animationDelay: `${(i % 7) * 0.6}s` }}
                      />
                    ))}
                    <div className="hero-map-caption">
                      <span className="live-dot" />
                      {t('landing.map.caption', { n: cityCount })}
                    </div>
                  </div>

                  <div className="ws-side">
                    <div className="ws-card">
                      <div className="ws-card-head">
                        <span className="ws-card-title">
                          {t('landing.metric.open')}
                          <small>{lang === 'zh' ? '本月' : 'This month'}</small>
                        </span>
                        <Link to="/opportunities" className="arrow-sq" aria-label={t('landing.ctaPrimary')}>
                          <Icon name="arrowUpRight" size={13} strokeWidth={2} />
                        </Link>
                      </div>
                      <TickBar accent="green" seed={11} cluster={0.72} />
                      <div className="ws-card-foot">
                        <span className="ws-card-num num">{openNow}</span>
                        <span className="ws-card-unit">{t('db.mode.open')}</span>
                      </div>
                    </div>
                    <div className="ws-card">
                      <div className="ws-card-head">
                        <span className="ws-card-title">
                          {t('common.closingSoon')}
                          <small>≤ 7 {lang === 'zh' ? '天' : 'days'}</small>
                        </span>
                        <Link to="/opportunities" className="arrow-sq" aria-label={t('common.closingSoon')}>
                          <Icon name="arrowUpRight" size={13} strokeWidth={2} />
                        </Link>
                      </div>
                      <TickBar accent="orange" seed={23} cluster={0.28} />
                      <div className="ws-card-foot">
                        <span className="ws-card-num num">{closingSoon}</span>
                        <span className="ws-card-unit">{t('common.closingSoon')}</span>
                      </div>
                    </div>
                    <div className="ws-card ws-card-list">
                      <div className="ws-card-head">
                        <span className="ws-card-title">
                          {t('db.sort.recent')}
                          <small>{lang === 'zh' ? '编辑团队' : 'by the editors'}</small>
                        </span>
                      </div>
                      {recentlyDecoded.map((o) => (
                        <Link key={o.id} to={`/opportunities/${o.slug}`} className="ws-mini">
                          <span className="ws-mini-dot" />
                          <span className="ws-mini-name">{o.name}</span>
                          <Icon name="arrowUpRight" size={11} strokeWidth={2} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>

            {floatCards.map((o, i) => (
              <Link key={o.id} to={`/opportunities/${o.slug}`} className={`hero-float glass-card hero-float-${i}`}>
                <span className="hero-float-type">{tv(o.types[0])}</span>
                <span className="hero-float-name">{o.name}</span>
                <DeadlineChip opp={o} />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─────────── how it works ─────────── */}
      <section className="section" id="how">
        <Reveal>
          <span className="kicker kicker-plain kicker-orange">{t('landing.how.kicker')}</span>
          <h2 className="section-title">
            {t('landing.how.title1')} <span className="dim">{t('landing.how.title2')}</span>
          </h2>
        </Reveal>
        <div className="how-grid">
          {([1, 2, 3] as const).map((n, i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="how-card card">
                <div className="how-num">
                  <span>{n}</span>
                  <Icon name={n === 1 ? 'search' : n === 2 ? 'compass' : 'map'} size={20} strokeWidth={1.5} />
                </div>
                <h3>{t(`landing.how.s${n}.title`)}</h3>
                <p>{t(`landing.how.s${n}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── eligibility lens demo ─────────── */}
      <section className="section lens-demo-section">
        <div className="lens-demo-grid">
          <Reveal className="lens-demo-copy">
            <span className="kicker kicker-plain">{t('landing.lens.kicker')}</span>
            <h2 className="section-title">
              {t('landing.lens.title1')} <span className="dim">{t('landing.lens.title2')}</span>
            </h2>
            <p className="section-body">{t('landing.lens.body')}</p>
            <p className="lens-demo-try">{t('landing.lens.try')}</p>
            <div className="lens-demo-chips">
              {LENS_DEMO_NATIONS.map((code) => (
                <button
                  key={code}
                  className={`chip chip-select ${demoNation === code ? 'on' : ''}`}
                  onClick={() => setDemoNation(demoNation === code ? null : code)}
                  aria-pressed={demoNation === code}
                >
                  {lang === 'zh'
                    ? { CN: '中国', NG: '尼日利亚', IN: '印度', BR: '巴西', DE: '德国' }[code]
                    : { CN: 'China', NG: 'Nigeria', IN: 'India', BR: 'Brazil', DE: 'Germany' }[code]}
                </button>
              ))}
            </div>
            {demoNation && (
              <p className="lens-demo-result" aria-live="polite">
                <Icon name="sparkle" size={13} />
                {t('landing.lens.match', { n: demoOpen, total: demoOpps.length })}
              </p>
            )}
            <Link to="/opportunities" className="btn btn-outline">
              {t('landing.lens.cta')}
              <Icon name="arrowRight" size={15} strokeWidth={2} />
            </Link>
          </Reveal>
          <Reveal delay={120} className="lens-demo-panel-reveal">
            <div className="lens-demo-panel card">
              {demoOpps.map((o) => {
                const passes = lensPasses(o, demoLens);
                const restricted = o.nationalities.length > 0;
                return (
                  <div key={o.id} className={`lens-demo-row ${demoNation && !passes ? 'locked' : ''}`}>
                    <div className="lens-demo-row-main">
                      <span className="lens-demo-name">{o.name}</span>
                      <span className="lens-demo-type">{tv(o.types[0])}</span>
                    </div>
                    {demoNation ? (
                      passes ? (
                        restricted ? (
                          <span className="chip chip-green-solid lens-badge">
                            <Icon name="check" size={11} strokeWidth={2.6} />
                            {t('common.openToYou')}
                          </span>
                        ) : (
                          <span className="chip chip-green">{t('common.openNow')}</span>
                        )
                      ) : (
                        <span className="chip chip-muted">
                          <Icon name="lock" size={11} strokeWidth={2} />
                        </span>
                      )
                    ) : restricted ? (
                      <span className="nat-hint">
                        <Icon name="info" size={12} strokeWidth={2} />
                        {t('common.natCriteria')}
                      </span>
                    ) : (
                      <span className="chip chip-green">{t('common.openNow')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── categories ─────────── */}
      <section className="section">
        <Reveal>
          <span className="kicker kicker-plain kicker-gold">{t('landing.types.kicker')}</span>
          <h2 className="section-title">{t('landing.types.title')}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="type-cloud">
            {PROGRAM_TYPES.map((ty) => (
              <Link key={ty} to={`/opportunities?type=${encodeURIComponent(ty)}`} className="type-pill">
                {tv(ty)}
                <span className="type-count">{typeCounts.get(ty)}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─────────── resources teaser ─────────── */}
      <section className="section">
        <div className="res-teaser-head">
          <Reveal>
            <span className="kicker kicker-plain kicker-green">{t('landing.resources.kicker')}</span>
            <h2 className="section-title">
              {t('landing.resources.title1')} <span className="dim">{t('landing.resources.title2')}</span>
            </h2>
            <p className="section-body">{t('landing.resources.body')}</p>
          </Reveal>
        </div>
        <div className="res-teaser-grid">
          {teaserArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 90}>
              <Link to={`/resources/${a.slug}`} className="card res-card">
                <div className="res-card-top">
                  <span className="res-cat">{t(`res.cat.${a.category}`)}</span>
                  <span className="arrow-sq" aria-hidden="true">
                    <Icon name="arrowUpRight" size={13} strokeWidth={2} />
                  </span>
                </div>
                <h3>{tb(a.title)}</h3>
                <p>{tb(a.excerpt)}</p>
                <span className="res-meta">
                  <Icon name="eye" size={13} strokeWidth={1.8} />
                  {t('res.readTime', { n: a.readMinutes })}
                  <span className="res-lock">
                    <Icon name="lock" size={11} strokeWidth={2} />
                    {t('res.memberOnly')}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────── final CTA ─────────── */}
      <section className="section cta-band-wrap">
        <Reveal>
          <div className="cta-band">
            <div className="cta-band-rings" aria-hidden="true">
              <span /><span />
            </div>
            <Logo size={40} />
            <h2>
              {t('landing.cta.title1')} <span className="dim-light">{t('landing.cta.title2')}</span>
            </h2>
            <p>{t('landing.cta.body')}</p>
            <div className="hero-ctas">
              <Link to="/auth/signup" className="btn btn-primary btn-lg">
                {t('common.getStarted')}
              </Link>
              <Link to="/opportunities" className="btn btn-ghost-light btn-lg">
                {t('landing.ctaPrimary')}
                <Icon name="arrowRight" size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
