import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/store';
import { LEGAL_PRIVACY, LEGAL_TERMS } from '../i18n/translations';
import { Icon, Logo, Reveal } from '../components/ui';
import { WorldDots } from '../components/mapview';

// ─────────────────────────── About ───────────────────────────

export function AboutPage() {
  const { t } = useApp();
  return (
    <div className="page about-page">
      <header className="about-hero">
        <Reveal>
          <span className="kicker">{t('about.kicker')}</span>
          <h1 className="hero-title">
            {t('about.title1')} <span className="dim">{t('about.title2')}</span>
          </h1>
          <p className="hero-sub">{t('about.lede')}</p>
        </Reveal>
        <div className="about-hero-art" aria-hidden="true">
          <WorldDots className="about-world" />
        </div>
      </header>

      <Reveal>
        <section className="about-story">
          <h2>{t('about.story.title')}</h2>
          <div className="about-story-cols">
            <p>{t('about.story.p1')}</p>
            <p>{t('about.story.p2')}</p>
            <p>{t('about.story.p3')}</p>
          </div>
        </section>
      </Reveal>

      <div className="about-mv">
        <Reveal>
          <div className="card mv-card">
            <span className="mv-icon"><Icon name="compass" size={18} strokeWidth={1.7} /></span>
            <h3>{t('about.mission.title')}</h3>
            <p>{t('about.mission.body')}</p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="card mv-card">
            <span className="mv-icon"><Icon name="eye" size={18} strokeWidth={1.7} /></span>
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.body')}</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <section className="about-values">
          <h2>{t('about.values.title')}</h2>
          <div className="values-grid">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="card value-card">
                <span className="value-num">0{n}</span>
                <h3>{t(`about.value${n}.title`)}</h3>
                <p>{t(`about.value${n}.body`)}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <div className="about-cta">
          <Logo size={36} />
          <p className="footer-tagline">{t('common.tagline')}</p>
          <Link to="/opportunities" className="btn btn-primary btn-lg">
            {t('about.cta')}
            <Icon name="arrowRight" size={16} strokeWidth={2} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

// ─────────────────────────── Support ───────────────────────────

const FAQ_KEYS = [1, 2, 3, 4, 5, 6] as const;

export function SupportPage() {
  const { t, toast } = useApp();
  const [open, setOpen] = useState<number | null>(1);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div className="page page-narrow support-page">
      <header className="page-header">
        <h1>{t('sup.title')}</h1>
        <p>{t('sup.sub')}</p>
      </header>

      <section className="faq-section">
        <h2>{t('sup.faq.title')}</h2>
        <div className="faq-list">
          {FAQ_KEYS.map((n) => (
            <div key={n} className={`faq-item ${open === n ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setOpen(open === n ? null : n)} aria-expanded={open === n}>
                <span>{t(`sup.q${n}`)}</span>
                <Icon name="chevronDown" size={16} strokeWidth={2} className={open === n ? 'rot180' : ''} />
              </button>
              <div className="faq-a">
                <p>{t(`sup.a${n}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card contact-card">
        <h2>{t('sup.contact.title')}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim() || !message.trim()) return;
            setEmail('');
            setMessage('');
            toast(t('sup.contact.sent'), 'success');
          }}
        >
          <label className="field">
            <span className="field-label">{t('sup.contact.email')}</span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field-label">{t('sup.contact.message')}</span>
            <textarea className="input textarea" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>
          <button type="submit" className="btn btn-primary">
            <Icon name="mail" size={15} strokeWidth={1.8} />
            {t('sup.contact.send')}
          </button>
        </form>
      </section>
    </div>
  );
}

// ─────────────────────────── Legal ───────────────────────────

export function PrivacyPage() {
  const { t, tb } = useApp();
  return (
    <div className="page page-narrow legal-page">
      <header className="page-header">
        <h1>{t('legal.privacy.title')}</h1>
        <p className="legal-updated">{t('legal.privacy.updated')}</p>
      </header>
      <div className="legal-body">
        {LEGAL_PRIVACY.map((p, i) => (
          <p key={i}>{tb(p)}</p>
        ))}
      </div>
    </div>
  );
}

export function TermsPage() {
  const { t, tb } = useApp();
  return (
    <div className="page page-narrow legal-page">
      <header className="page-header">
        <h1>{t('legal.terms.title')}</h1>
        <p className="legal-updated">{t('legal.terms.updated')}</p>
      </header>
      <div className="legal-body">
        {LEGAL_TERMS.map((p, i) => (
          <p key={i}>{tb(p)}</p>
        ))}
      </div>
    </div>
  );
}
