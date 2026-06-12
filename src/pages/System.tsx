import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/store';
import { Icon } from '../components/ui';

/** Broken-circle motif used by the system pages. */
function BrokenCircleArt() {
  return (
    <div className="syspage-art" aria-hidden="true">
      <svg viewBox="0 0 200 200" width={180} height={180}>
        <circle cx="100" cy="100" r="78" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="3 7" />
        <path d="M 126 33 A 72 72 0 1 0 168 82" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
        <path d="M168 8 Q170.4 17.6 180 20 Q170.4 22.4 168 32 Q165.6 22.4 156 20 Q165.6 17.6 168 8 Z" fill="var(--violet)" />
      </svg>
    </div>
  );
}

export function NotFoundPage() {
  const { t } = useApp();
  return (
    <div className="page syspage">
      <BrokenCircleArt />
      <span className="syspage-kicker">{t('err404.kicker')}</span>
      <h1>{t('err404.title')}</h1>
      <p>{t('err404.body')}</p>
      <div className="syspage-actions">
        <Link to="/" className="btn btn-primary">
          {t('err404.home')}
        </Link>
        <Link to="/opportunities" className="btn btn-outline">
          {t('err404.db')}
          <Icon name="arrowRight" size={15} strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

export function ErrorPage() {
  const { t } = useApp();
  return (
    <div className="page syspage">
      <BrokenCircleArt />
      <span className="syspage-kicker">
        <Icon name="alert" size={14} strokeWidth={1.9} />
      </span>
      <h1>{t('err.title')}</h1>
      <p>{t('err.body')}</p>
      <div className="syspage-actions">
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          {t('err.reload')}
        </button>
        <Link to="/" className="btn btn-outline">
          {t('err404.home')}
        </Link>
      </div>
    </div>
  );
}

interface BoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, BoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
