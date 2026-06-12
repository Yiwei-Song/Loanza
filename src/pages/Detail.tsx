import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOpportunity, relatedOpportunities } from '../data/opportunities';
import { useApp } from '../state/store';
import { countryName } from '../data/countries';
import { formatDate, formatDateRange, isOpen } from '../lib/dates';
import { EmptyState, Icon } from '../components/ui';
import { DeadlineChip, LensBadge, OpportunityCard, SaveButton, ShareButton, locationLabel } from '../components/opportunity';

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, tb, tv, lang } = useApp();
  const opp = slug ? getOpportunity(slug) : undefined;

  useEffect(() => {
    document.title = opp ? `${opp.name} — Circle Breaker` : 'Circle Breaker';
  }, [opp]);

  if (!opp) {
    return (
      <div className="page page-narrow">
        <EmptyState
          icon="compass"
          title={t('detail.notFound.title')}
          body={t('detail.notFound.body')}
          action={
            <Link to="/opportunities" className="btn btn-primary">
              {t('detail.back')}
            </Link>
          }
        />
      </div>
    );
  }

  const body = opp.body;
  const hasBody = Boolean(
    body && (body.summary || body.benefits?.length || body.eligibility?.length || body.process?.length || body.tips || body.timeline?.length),
  );
  const related = relatedOpportunities(opp);
  const closed = !isOpen(opp.deadline);

  const reqRow = (label: string, value: React.ReactNode) => (
    <div className="req-row">
      <span className="req-label">{label}</span>
      <span className="req-value">{value}</span>
    </div>
  );

  return (
    <div className="page detail-page">
      <nav className="breadcrumb">
        <Link to="/opportunities">
          <Icon name="arrowLeft" size={14} strokeWidth={2} />
          {t('detail.back')}
        </Link>
      </nav>

      <header className="detail-hero">
        <div className="detail-hero-main">
          <div className="opp-chips">
            {opp.types.map((type) => (
              <span key={type} className="chip chip-violet">
                {tv(type)}
              </span>
            ))}
            <LensBadge opp={opp} />
            {closed && <span className="chip chip-muted">{t('common.closed')}</span>}
          </div>
          <h1 className="detail-name">{opp.name}</h1>
          <div className="detail-subline">
            {opp.host && (
              <span className="detail-host">
                <Icon name="briefcase" size={14} strokeWidth={1.8} />
                {opp.host}
              </span>
            )}
            <span className="detail-host">
              <Icon name="pin" size={14} strokeWidth={1.8} />
              {locationLabel(opp, lang, tv)}
            </span>
            {opp.recurrence && (
              <span className="detail-host">
                <Icon name="clock" size={14} strokeWidth={1.8} />
                {tv(opp.recurrence)}
              </span>
            )}
          </div>
          <p className="detail-lede">{tb(opp.summary)}</p>
          <div className="detail-actions">
            {opp.officialUrl ? (
              <a className="btn btn-primary" href={opp.officialUrl} target="_blank" rel="noreferrer">
                {t('detail.officialCta')}
                <Icon name="arrowUpRight" size={15} strokeWidth={2.1} />
              </a>
            ) : (
              <span className="btn btn-disabled" aria-disabled="true">
                <Icon name="clock" size={15} strokeWidth={1.8} />
                {t('detail.officialSoon')}
              </span>
            )}
            <SaveButton opp={opp} large />
            <ShareButton opp={opp} />
          </div>
        </div>

        <aside className="detail-facts card">
          <h3>{t('detail.keyFacts')}</h3>
          <div className="fact-row">
            <span className="fact-label">
              <Icon name="banknote" size={14} strokeWidth={1.8} /> {t('detail.funding')}
            </span>
            <span className="fact-value">{opp.funding.map((f) => tv(f)).join(' · ')}</span>
          </div>
          <div className="fact-row">
            <span className="fact-label">
              <Icon name="calendar" size={14} strokeWidth={1.8} /> {t('detail.dates')}
            </span>
            <span className="fact-value">{formatDateRange(opp.start, opp.end, lang)}</span>
          </div>
          <div className="fact-row">
            <span className="fact-label">
              <Icon name="clock" size={14} strokeWidth={1.8} /> {t('detail.duration')}
            </span>
            <span className="fact-value">{opp.durations.map((d) => tv(d)).join(' · ')}</span>
          </div>
          <div className="fact-row">
            <span className="fact-label">
              <Icon name="globe" size={14} strokeWidth={1.8} /> {t('detail.mode')}
            </span>
            <span className="fact-value">{opp.modes.map((m) => tv(m)).join(' · ')}</span>
          </div>
          <div className="fact-deadline">
            <span className="fact-label">{t('common.deadline')}</span>
            <div className="fact-deadline-line">
              <DeadlineChip opp={opp} />
              {opp.deadline && <span className="fact-deadline-date">{formatDate(opp.deadline, lang)}</span>}
            </div>
          </div>

          <div className="req-card">
            <h4>{t('detail.requirements')}</h4>
            {reqRow(t('detail.req.degree'), opp.degrees.length === 0 ? t('detail.req.open') : opp.degrees.map((d) => tv(d)).join(' / '))}
            {reqRow(t('detail.req.experience'), tv(opp.experience))}
            {reqRow(
              t('detail.req.nationality'),
              opp.nationalities.length === 0 ? (
                t('detail.req.open')
              ) : (
                <span title={opp.nationalities.map((c) => countryName(c, lang)).join(', ')}>
                  {opp.nationalities.length <= 3
                    ? opp.nationalities.map((c) => countryName(c, lang)).join(', ')
                    : t('detail.req.countries', { n: opp.nationalities.length })}
                </span>
              ),
            )}
            {reqRow(
              t('detail.req.residency'),
              opp.residencies.length === 0
                ? t('detail.req.open')
                : t('detail.req.countries', { n: opp.residencies.length }),
            )}
          </div>
        </aside>
      </header>

      {hasBody ? (
        <div className="detail-body">
          {body?.summary && (
            <section className="detail-section">
              <h2>{t('detail.section.summary')}</h2>
              <p className="detail-summary-text">{tb(body.summary)}</p>
            </section>
          )}

          {body?.benefits && body.benefits.length > 0 && (
            <section className="detail-section">
              <h2>{t('detail.section.benefits')}</h2>
              <ul className="benefit-list">
                {body.benefits.map((b, i) => (
                  <li key={i}>
                    <span className="benefit-check">
                      <Icon name="check" size={12} strokeWidth={2.6} />
                    </span>
                    {tb(b)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {body?.eligibility && body.eligibility.length > 0 && (
            <section className="detail-section">
              <h2>{t('detail.section.eligibility')}</h2>
              <ul className="eligibility-list">
                {body.eligibility.map((b, i) => (
                  <li key={i}>{tb(b)}</li>
                ))}
              </ul>
            </section>
          )}

          {body?.process && body.process.length > 0 && (
            <section className="detail-section">
              <h2>{t('detail.section.process')}</h2>
              <ol className="process-list">
                {body.process.map((step, i) => (
                  <li key={i}>
                    <span className="process-num">{i + 1}</span>
                    <span>{tb(step)}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {body?.tips && (
            <section className="detail-section">
              <div className="tips-callout">
                <div className="tips-head">
                  <Icon name="sparkle" size={16} />
                  <h2>{t('detail.section.tips')}</h2>
                </div>
                <p>{tb(body.tips)}</p>
              </div>
            </section>
          )}

          {body?.timeline && body.timeline.length > 0 && (
            <section className="detail-section">
              <h2>{t('detail.section.timeline')}</h2>
              <div className="timeline">
                {body.timeline.map((entry, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-marker">
                      <span className="timeline-dot" />
                      {i < body.timeline!.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-label">{tb(entry.label)}</span>
                      <span className="timeline-date">{tb(entry.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="detail-body">
          <div className="preparing-card">
            <div className="preparing-rings" aria-hidden="true">
              <span /><span /><span />
            </div>
            <h3>{t('detail.preparing.title')}</h3>
            <p>{t('detail.preparing.body')}</p>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="detail-related">
          <h2>{t('detail.related')}</h2>
          <div className="opp-grid">
            {related.map((r) => (
              <OpportunityCard key={r.id} opp={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
