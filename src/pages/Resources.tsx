import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { RESOURCES, RESOURCE_CATEGORIES, getResource } from '../data/resources';
import { useApp } from '../state/store';
import { EmptyState, Icon, Skeleton } from '../components/ui';

// ─────────────────────────── Hub ───────────────────────────

export default function ResourcesPage() {
  const { t, tb, user } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cat, setCat] = useState<string>('all');
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const simulateError = searchParams.get('state') === 'error';

  useEffect(() => {
    setPhase('loading');
    const timer = window.setTimeout(() => setPhase(simulateError ? 'error' : 'ready'), 550);
    return () => window.clearTimeout(timer);
  }, [simulateError]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (cat !== 'all' && r.category !== cat) return false;
      if (!needle) return true;
      return (
        r.title.en.toLowerCase().includes(needle) ||
        r.title.zh.includes(needle) ||
        r.excerpt.en.toLowerCase().includes(needle) ||
        r.excerpt.zh.includes(needle)
      );
    });
  }, [cat, q]);

  const isMember = Boolean(user?.member);

  return (
    <div className="page res-page">
      <header className="page-header">
        <h1>{t('res.title')}</h1>
        <p>{t('res.sub')}</p>
      </header>

      <div className="res-toolbar">
        <div className="chip-row">
          <button className={`chip chip-select ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>
            {t('res.all')}
          </button>
          {RESOURCE_CATEGORIES.map((c) => (
            <button key={c} className={`chip chip-select ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
              {t(`res.cat.${c}`)}
            </button>
          ))}
        </div>
        <div className="searchbox searchbox-sm">
          <Icon name="search" size={15} strokeWidth={1.9} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} aria-label={t('common.search')} />
        </div>
      </div>

      {!isMember && (
        <MembershipGate />
      )}

      {phase === 'loading' && (
        <div className="res-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card res-card" aria-hidden="true">
              <Skeleton w={80} h={20} r={99} />
              <Skeleton w="90%" h={18} />
              <Skeleton w="100%" h={12} />
              <Skeleton w="70%" h={12} />
            </div>
          ))}
        </div>
      )}

      {phase === 'error' && (
        <EmptyState
          icon="alert"
          title={t('db.error.title')}
          body={t('db.error.body')}
          action={
            <button
              className="btn btn-primary"
              onClick={() => {
                searchParams.delete('state');
                setSearchParams(searchParams, { replace: true });
              }}
            >
              {t('common.retry')}
            </button>
          }
        />
      )}

      {phase === 'ready' && list.length === 0 && (
        <EmptyState icon="layers" title={t('res.empty.title')} body={t('res.empty.body')} />
      )}

      {phase === 'ready' && list.length > 0 && (
        <div className="res-grid">
          {list.map((a) => (
            <Link key={a.id} to={`/resources/${a.slug}`} className="card res-card">
              <span className="res-cat">{t(`res.cat.${a.category}`)}</span>
              <h3>{tb(a.title)}</h3>
              <p>{tb(a.excerpt)}</p>
              <span className="res-meta">
                <Icon name="eye" size={13} strokeWidth={1.8} />
                {t('res.readTime', { n: a.readMinutes })}
                {!isMember && (
                  <span className="res-lock">
                    <Icon name="lock" size={11} strokeWidth={2} />
                    {t('res.memberOnly')}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── Gate panel ───────────────────────────

function MembershipGate() {
  const { t, user, setMember, toast } = useApp();
  const navigate = useNavigate();
  return (
    <div className="gate-card">
      <div className="gate-icon">
        <Icon name="sparkle" size={20} />
      </div>
      <div className="gate-text">
        <h3>{t('res.gate.title')}</h3>
        <p>{t('res.gate.body')}</p>
      </div>
      <div className="gate-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (!user) {
              navigate('/auth/signup');
              return;
            }
            setMember(true);
            toast(t('up.toast'), 'success');
          }}
        >
          <Icon name="sparkle" size={14} />
          {t('res.gate.cta')}
        </button>
        {!user && (
          <Link to="/auth/signin" className="btn btn-ghost">
            {t('res.gate.signin')}
          </Link>
        )}
        <span className="gate-note">{t('res.gate.note')}</span>
      </div>
    </div>
  );
}

// ─────────────────────────── Article ───────────────────────────

export function ResourceArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, tb, user } = useApp();
  const article = slug ? getResource(slug) : undefined;

  useEffect(() => {
    document.title = article ? `${article.title.en} — Circle Breaker` : 'Resources — Circle Breaker';
  }, [article]);

  if (!article) {
    return (
      <div className="page page-narrow">
        <EmptyState
          icon="layers"
          title={t('res.empty.title')}
          body={t('res.empty.body')}
          action={
            <Link to="/resources" className="btn btn-primary">
              {t('res.title')}
            </Link>
          }
        />
      </div>
    );
  }

  const isMember = Boolean(user?.member);
  const paragraphs = isMember ? article.body : article.body.slice(0, 1);

  return (
    <div className="page page-narrow article-page">
      <nav className="breadcrumb">
        <Link to="/resources">
          <Icon name="arrowLeft" size={14} strokeWidth={2} />
          {t('res.title')}
        </Link>
      </nav>
      <span className="res-cat">{t(`res.cat.${article.category}`)}</span>
      <h1 className="article-title">{tb(article.title)}</h1>
      <p className="article-meta">
        <Icon name="eye" size={13} strokeWidth={1.8} />
        {t('res.readTime', { n: article.readMinutes })}
      </p>
      <div className={`article-body ${!isMember ? 'article-faded' : ''}`}>
        {paragraphs.map((p, i) => (
          <p key={i}>{tb(p)}</p>
        ))}
      </div>
      {!isMember && (
        <div className="article-gate">
          <div className="article-gate-fade" aria-hidden="true" />
          <MembershipGate />
        </div>
      )}
    </div>
  );
}
