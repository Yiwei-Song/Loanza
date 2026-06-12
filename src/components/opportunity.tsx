import React, { createContext, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Opportunity } from '../types';
import { useApp } from '../state/store';
import { countryName } from '../data/countries';
import { daysUntil, formatDate, isOpen } from '../lib/dates';
import { isOpenToYou } from '../lib/eligibility';
import { Icon, Modal } from './ui';

// ─────────────────────────── Save prompt (anonymous users) ───────────────────────────

const SavePromptCtx = createContext<{ ask: () => void }>({ ask: () => {} });

export function SavePromptProvider({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <SavePromptCtx.Provider value={{ ask: () => setOpen(true) }}>
      {children}
      <Modal open={open} onClose={() => setOpen(false)} label={t('auth.savePrompt.title')} width={420}>
        <div className="save-prompt">
          <div className="save-prompt-icon">
            <Icon name="bookmark" size={22} strokeWidth={1.6} />
          </div>
          <h3>{t('auth.savePrompt.title')}</h3>
          <p>{t('auth.savePrompt.body')}</p>
          <div className="save-prompt-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                setOpen(false);
                navigate('/auth/signup');
              }}
            >
              {t('auth.createOne')}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setOpen(false);
                navigate('/auth/signin');
              }}
            >
              {t('common.signIn')}
            </button>
          </div>
        </div>
      </Modal>
    </SavePromptCtx.Provider>
  );
}

// ─────────────────────────── Save button ───────────────────────────

export function SaveButton({ opp, large }: { opp: Opportunity; large?: boolean }) {
  const { t, user, isSaved, toggleSave, toast } = useApp();
  const { ask } = useContext(SavePromptCtx);
  const saved = isSaved(opp.id);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      ask();
      return;
    }
    const nowSaved = toggleSave(opp.id);
    toast(nowSaved ? t('toast.saved') : t('toast.unsaved'), nowSaved ? 'success' : 'default');
  };

  return (
    <button
      className={`save-btn ${saved ? 'saved' : ''} ${large ? 'save-btn-lg' : ''}`}
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? t('common.saved') : t('common.save')}
      title={saved ? t('common.saved') : t('common.save')}
    >
      <Icon name={saved ? 'bookmarkFill' : 'bookmark'} size={large ? 18 : 16} strokeWidth={1.7} />
      {large && <span>{saved ? t('common.saved') : t('common.save')}</span>}
    </button>
  );
}

// ─────────────────────────── Deadline chip ───────────────────────────

export function DeadlineChip({ opp, withIcon = true }: { opp: Opportunity; withIcon?: boolean }) {
  const { t, lang } = useApp();
  if (!opp.deadline) {
    return (
      <span className="chip chip-green deadline-chip">
        {withIcon && <Icon name="clock" size={12} strokeWidth={2} />}
        {t('common.rolling')}
      </span>
    );
  }
  const d = daysUntil(opp.deadline);
  if (d < 0) {
    return (
      <span className="chip chip-muted deadline-chip">
        {withIcon && <Icon name="calendar" size={12} strokeWidth={2} />}
        {t('common.closed')}
      </span>
    );
  }
  if (d <= 7) {
    const label = d === 0 ? t('common.dueToday') : d === 1 ? t('common.dueTomorrow') : t('common.daysLeft', { n: d });
    return (
      <span className="chip chip-orange deadline-chip pulse-soft">
        {withIcon && <Icon name="clock" size={12} strokeWidth={2} />}
        {label}
      </span>
    );
  }
  return (
    <span className="chip chip-plain deadline-chip">
      {withIcon && <Icon name="calendar" size={12} strokeWidth={2} />}
      {formatDate(opp.deadline, lang, { short: true })}
    </span>
  );
}

// ─────────────────────────── Lens badge ───────────────────────────

export function LensBadge({ opp }: { opp: Opportunity }) {
  const { t, lens } = useApp();
  if (isOpenToYou(opp, lens)) {
    return (
      <span className="chip chip-green-solid lens-badge">
        <Icon name="check" size={11} strokeWidth={2.6} />
        {t('common.openToYou')}
      </span>
    );
  }
  if (lens.length === 0 && opp.nationalities.length > 0) {
    return (
      <span className="nat-hint" title={t('common.natCriteria')}>
        <Icon name="info" size={12} strokeWidth={2} />
        {t('common.natCriteria')}
      </span>
    );
  }
  return null;
}

// ─────────────────────────── Meta line ───────────────────────────

export function locationLabel(opp: Opportunity, lang: 'en' | 'zh', tv: (s: string) => string): string {
  if (opp.cities.length > 0) {
    const city = opp.cities[0];
    const extra = opp.cities.length > 1 ? ` +${opp.cities.length - 1}` : '';
    const country = opp.countries[0] ? countryName(opp.countries[0], lang) : '';
    return country ? `${city}, ${country}${extra}` : `${city}${extra}`;
  }
  if (opp.modes.length === 1 && opp.modes[0] === 'Remote') return tv('Remote');
  return tv(opp.region);
}

export function MetaLine({ opp, compact }: { opp: Opportunity; compact?: boolean }) {
  const { lang, tv } = useApp();
  const duration = opp.durations[0] ? tv(opp.durations[0]) : '';
  const funding = opp.funding.map((f) => tv(f)).join(' · ');
  return (
    <div className={`opp-meta ${compact ? 'compact' : ''}`}>
      <span className="opp-meta-item">
        <Icon name="pin" size={13} strokeWidth={1.8} />
        {locationLabel(opp, lang, tv)}
      </span>
      <span className="opp-meta-item">
        <Icon name="banknote" size={13} strokeWidth={1.8} />
        {funding}
      </span>
      {duration && (
        <span className="opp-meta-item">
          <Icon name="clock" size={13} strokeWidth={1.8} />
          {duration}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────── Gallery card ───────────────────────────

export function OpportunityCard({ opp, reveal }: { opp: Opportunity; reveal?: boolean }) {
  const { t, tb, tv } = useApp();
  const closed = !isOpen(opp.deadline);
  return (
    <article className={`card opp-card ${closed ? 'opp-closed' : ''} ${reveal ? 'card-reveal' : ''}`}>
      <div className="opp-card-top">
        <div className="opp-chips">
          {opp.types.slice(0, 2).map((type) => (
            <span key={type} className="chip chip-violet">
              {tv(type)}
            </span>
          ))}
          <LensBadge opp={opp} />
        </div>
        <SaveButton opp={opp} />
      </div>

      <h3 className="opp-name">
        <Link to={`/opportunities/${opp.slug}`} className="opp-link">
          {opp.name}
        </Link>
      </h3>
      {opp.host && <div className="opp-host">{opp.host}</div>}
      <p className="opp-summary">{tb(opp.summary)}</p>

      <MetaLine opp={opp} />

      <div className="opp-card-foot">
        <DeadlineChip opp={opp} />
        <span className="opp-foot-spacer" />
        {opp.officialUrl && (
          <a
            href={opp.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="opp-official"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${t('common.official')} — ${opp.name}`}
          >
            {t('common.official')}
            <Icon name="arrowUpRight" size={12} strokeWidth={2.2} />
          </a>
        )}
      </div>
    </article>
  );
}

// ─────────────────────────── List row ───────────────────────────

export function OpportunityRow({ opp }: { opp: Opportunity }) {
  const { t, tv, lang } = useApp();
  const closed = !isOpen(opp.deadline);
  return (
    <div className={`opp-row ${closed ? 'opp-closed' : ''}`}>
      <SaveButton opp={opp} />
      <div className="opp-row-main">
        <Link to={`/opportunities/${opp.slug}`} className="opp-row-name opp-link">
          {opp.name}
        </Link>
        <span className="opp-row-host">{opp.host}</span>
        <span className="opp-row-badges">
          <LensBadge opp={opp} />
        </span>
      </div>
      <span className="opp-row-cell opp-row-type">{opp.types.map((x) => tv(x)).join(' · ')}</span>
      <span className="opp-row-cell">
        <Icon name="pin" size={12} strokeWidth={1.8} /> {locationLabel(opp, lang, tv)}
      </span>
      <span className="opp-row-cell">{opp.funding.map((f) => tv(f)).join(' · ')}</span>
      <span className="opp-row-deadline">
        <DeadlineChip opp={opp} />
      </span>
      {opp.officialUrl ? (
        <a
          href={opp.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="icon-btn opp-row-ext"
          aria-label={`${t('common.official')} — ${opp.name}`}
        >
          <Icon name="arrowUpRight" size={14} strokeWidth={2} />
        </a>
      ) : (
        <span className="opp-row-ext" />
      )}
    </div>
  );
}

// ─────────────────────────── Mini card (map popovers, dashboards) ───────────────────────────

export function OpportunityMini({ opp }: { opp: Opportunity }) {
  const { tv } = useApp();
  return (
    <div className="opp-mini">
      <div className="opp-mini-main">
        <Link to={`/opportunities/${opp.slug}`} className="opp-mini-name opp-link">
          {opp.name}
        </Link>
        <span className="opp-mini-type">{opp.types.map((x) => tv(x)).join(' · ')}</span>
      </div>
      <DeadlineChip opp={opp} withIcon={false} />
      <SaveButton opp={opp} />
    </div>
  );
}

// ─────────────────────────── Share button ───────────────────────────

export function ShareButton({ opp }: { opp: Opportunity }) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/opportunities/${opp.slug}`;
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: opp.name, url });
        return;
      } catch {
        /* user dismissed the sheet — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button className="btn btn-outline" onClick={share}>
      <Icon name={copied ? 'check' : 'share'} size={15} strokeWidth={1.8} />
      {copied ? t('common.copied') : t('common.share')}
    </button>
  );
}
