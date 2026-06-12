import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { OPPORTUNITIES } from '../data/opportunities';
import { useApp } from '../state/store';
import { daysUntil, isOpen, formatDate } from '../lib/dates';
import { isEligible, matchesInterests, profileChecklist, relevanceScore } from '../lib/eligibility';
import { Icon, Reveal, TickBar, TickGauge } from '../components/ui';
import { DeadlineChip, OpportunityCard, SaveButton } from '../components/opportunity';

export default function DashboardPage() {
  const { t, tv, lang, user, saved } = useApp();
  if (!user) return null; // guarded by RequireAuth

  const checklist = profileChecklist(user.profile);
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'dash.greeting.morning' : hour < 18 ? 'dash.greeting.afternoon' : 'dash.greeting.evening';
  const firstName = user.name.split(/\s+/)[0];

  const savedOpps = useMemo(() => OPPORTUNITIES.filter((o) => saved.has(o.id)), [saved]);

  const upcoming = useMemo(
    () =>
      savedOpps
        .filter((o) => o.deadline && isOpen(o.deadline))
        .sort((a, b) => a.deadline!.localeCompare(b.deadline!)),
    [savedOpps],
  );

  const hasInterests = user.profile.interestTypes.length > 0 || user.profile.interestSectors.length > 0;

  const recommended = useMemo(() => {
    if (!hasInterests) return [];
    return OPPORTUNITIES.filter(
      (o) =>
        !saved.has(o.id) &&
        isOpen(o.deadline) &&
        matchesInterests(o, user.profile) &&
        (!checklist.complete || isEligible(o, user.profile)),
    )
      .map((o) => ({ o, score: relevanceScore(o, user.profile) }))
      .sort((a, b) => b.score - a.score || (a.o.deadline ?? '9999').localeCompare(b.o.deadline ?? '9999'))
      .slice(0, 4)
      .map((x) => x.o);
  }, [hasInterests, saved, user.profile, checklist.complete]);

  const closingCount = upcoming.filter((o) => daysUntil(o.deadline!) <= 7).length;

  const whyFor = (oppId: string): string => {
    const opp = OPPORTUNITIES.find((o) => o.id === oppId)!;
    const matchType = opp.types.find((ty) => user.profile.interestTypes.includes(ty));
    if (matchType) return t('dash.reco.why.type', { x: tv(matchType) });
    const matchSector = opp.sectors.find((s) => user.profile.interestSectors.includes(s));
    if (matchSector) return t('dash.reco.why.type', { x: tv(matchSector) });
    return '';
  };

  return (
    <div className="page dash-page">
      <header className="dash-head">
        <div>
          <h1>{t(greetKey, { name: firstName })}</h1>
          <p>{t('dash.sub')}</p>
        </div>
        <Link to="/opportunities" className="btn btn-outline">
          {t('dash.viewDb')}
          <Icon name="arrowRight" size={15} strokeWidth={2} />
        </Link>
      </header>

      <div className="dash-stats">
        <div className="card stat-card">
          <div className="ws-card-head">
            <span className="ws-card-title">
              {t('dash.stat.saved')}
              <small>{t('dash.saved.title')}</small>
            </span>
            <Link to="/opportunities?saved=1" className="arrow-sq" aria-label={t('dash.stat.saved')}>
              <Icon name="arrowUpRight" size={13} strokeWidth={2} />
            </Link>
          </div>
          <TickBar accent="violet" seed={5} cluster={0.55} />
          <div className="ws-card-foot">
            <span className="ws-card-num num">{savedOpps.length}</span>
            <span className="ws-card-unit">{t('dash.stat.saved')}</span>
          </div>
        </div>
        <div className={`card stat-card ${closingCount > 0 ? 'stat-urgent' : ''}`}>
          <div className="ws-card-head">
            <span className="ws-card-title">
              {t('dash.stat.closing')}
              <small>≤ 7d</small>
            </span>
            <Link to="/opportunities?saved=1" className="arrow-sq" aria-label={t('dash.stat.closing')}>
              <Icon name="arrowUpRight" size={13} strokeWidth={2} />
            </Link>
          </div>
          <TickBar accent="orange" seed={17} cluster={0.24} />
          <div className="ws-card-foot">
            <span className="ws-card-num num">{closingCount}</span>
            <span className="ws-card-unit">{t('dash.stat.closing')}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="ws-card-head">
            <span className="ws-card-title">
              {t('dash.stat.matches')}
              <small>{t('dash.reco.title')}</small>
            </span>
            <Link to="/opportunities?match=1" className="arrow-sq" aria-label={t('dash.stat.matches')}>
              <Icon name="arrowUpRight" size={13} strokeWidth={2} />
            </Link>
          </div>
          <TickBar accent="green" seed={29} cluster={0.78} />
          <div className="ws-card-foot">
            <span className="ws-card-num num">{recommended.length}</span>
            <span className="ws-card-unit">{t('dash.stat.matches')}</span>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-col-main">
          {/* ── upcoming deadlines ── */}
          <Reveal>
            <section className="card dash-section">
              <h2>
                <Icon name="calendar" size={16} strokeWidth={1.8} />
                {t('dash.deadlines.title')}
              </h2>
              {upcoming.length === 0 ? (
                <div className="dash-empty">
                  <p className="dash-empty-title">{t('dash.deadlines.empty.title')}</p>
                  <p>{t('dash.deadlines.empty.body')}</p>
                </div>
              ) : (
                <div className="deadline-list">
                  {upcoming.map((o) => {
                    const d = daysUntil(o.deadline!);
                    const urgent = d <= 7;
                    return (
                      <div key={o.id} className={`deadline-row ${urgent ? 'urgent' : ''}`}>
                        <div className="deadline-row-main">
                          <Link to={`/opportunities/${o.slug}`} className="opp-link deadline-name">
                            {o.name}
                          </Link>
                          <span className="deadline-date">{formatDate(o.deadline!, lang, { short: true })}</span>
                        </div>
                        <DeadlineChip opp={o} />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </Reveal>

          {/* ── recommended ── */}
          <Reveal delay={80}>
            <section className="dash-section-plain">
              <h2>
                <Icon name="sparkle" size={15} />
                {t('dash.reco.title')}
              </h2>
              {!hasInterests ? (
                <div className="card dash-empty dash-empty-card">
                  <p className="dash-empty-title">{t('dash.reco.empty.title')}</p>
                  <p>{t('dash.reco.empty.body')}</p>
                  <Link to="/onboarding" className="btn btn-primary">
                    {t('dash.reco.empty.cta')}
                  </Link>
                </div>
              ) : (
                <div className="reco-grid">
                  {recommended.map((o) => (
                    <div key={o.id} className="reco-item">
                      <span className="reco-why">
                        <Icon name="sparkle" size={11} />
                        {whyFor(o.id)}
                      </span>
                      <OpportunityCard opp={o} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        </div>

        <div className="dash-col-side">
          {/* ── profile strength ── */}
          {!checklist.complete || checklist.percent < 100 ? (
            <Reveal>
              <section className="card dash-section profile-card">
                <h2>
                  <Icon name="user" size={16} strokeWidth={1.8} />
                  {t('dash.profile.title')}
                </h2>
                <div className="profile-meter">
                  <TickGauge percent={checklist.percent} accent="violet" />
                  <ul className="profile-checklist">
                    <li className={checklist.identity ? 'done' : ''}>
                      <span className="pc-box">{checklist.identity && <Icon name="check" size={10} strokeWidth={3} />}</span>
                      {t('dash.check.identity')}
                    </li>
                    <li className={checklist.education ? 'done' : ''}>
                      <span className="pc-box">{checklist.education && <Icon name="check" size={10} strokeWidth={3} />}</span>
                      {t('dash.check.education')}
                    </li>
                    <li className={checklist.interests ? 'done' : ''}>
                      <span className="pc-box">{checklist.interests && <Icon name="check" size={10} strokeWidth={3} />}</span>
                      {t('dash.check.interests')}
                    </li>
                  </ul>
                </div>
                <Link to="/onboarding" className="btn btn-primary btn-block">
                  {t('dash.profile.cta')}
                </Link>
              </section>
            </Reveal>
          ) : (
            <Reveal>
              <div className="profile-complete-chip">
                <Icon name="check" size={14} strokeWidth={2.4} />
                {t('dash.profile.done')}
              </div>
            </Reveal>
          )}

          {/* ── saved ── */}
          <Reveal delay={60}>
            <section className="card dash-section">
              <h2>
                <Icon name="bookmark" size={15} strokeWidth={1.8} />
                {t('dash.saved.title')}
              </h2>
              {savedOpps.length === 0 ? (
                <div className="dash-empty">
                  <p className="dash-empty-title">{t('dash.saved.empty.title')}</p>
                  <p>{t('dash.saved.empty.body')}</p>
                  <Link to="/opportunities" className="btn btn-outline">
                    {t('dash.saved.empty.cta')}
                  </Link>
                </div>
              ) : (
                <div className="saved-list">
                  {savedOpps.map((o) => (
                    <div key={o.id} className="saved-row">
                      <div className="saved-row-main">
                        <Link to={`/opportunities/${o.slug}`} className="opp-link saved-name">
                          {o.name}
                        </Link>
                        <span className="saved-type">{tv(o.types[0])}</span>
                      </div>
                      <SaveButton opp={o} />
                    </div>
                  ))}
                  <Link to="/opportunities?saved=1" className="saved-viewall">
                    {t('common.viewAll')}
                    <Icon name="arrowRight" size={13} strokeWidth={2} />
                  </Link>
                </div>
              )}
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
