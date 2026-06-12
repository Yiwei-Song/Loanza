import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../state/store';
import { Icon, Logo } from './ui';

// ─────────────────────────── Navbar ───────────────────────────

export function Navbar() {
  const { t, lang, setLang, user, signOut, toast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const links = (
    <>
      <NavLink to="/opportunities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        {t('nav.opportunities')}
      </NavLink>
      <NavLink to="/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        {t('nav.resources')}
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        {t('nav.about')}
      </NavLink>
      {user && (
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          {t('nav.dashboard')}
        </NavLink>
      )}
    </>
  );

  const langToggle = (
    <button
      className="lang-toggle"
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      aria-label={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <Icon name="globe" size={14} strokeWidth={1.8} />
      <span>{t('nav.language')}</span>
    </button>
  );

  const initials = user
    ? user.name
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <header className="navbar-wrap">
      <nav className="navbar" aria-label="Main">
        <Link to="/" className="nav-brand">
          <Logo size={26} />
          <span className="nav-wordmark">{t('common.appName')}</span>
        </Link>

        <div className="nav-center">{links}</div>

        <div className="nav-right">
          {langToggle}
          {user ? (
            <div className="nav-user" ref={userRef}>
              <button
                className="avatar-btn"
                onClick={() => setUserOpen((v) => !v)}
                aria-expanded={userOpen}
                aria-label={user.name}
              >
                <span className="avatar">{initials}</span>
                {user.member && <span className="avatar-spark" title={t('common.member')}><Icon name="sparkle" size={10} /></span>}
              </button>
              {userOpen && (
                <div className="user-menu">
                  <div className="user-menu-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <span className={`plan-chip ${user.member ? 'member' : ''}`}>
                      {user.member ? t('common.member') : t('common.freePlan')}
                    </span>
                  </div>
                  <Link to="/dashboard" className="user-menu-item">
                    <Icon name="grid" size={15} /> {t('nav.dashboard')}
                  </Link>
                  <Link to="/settings" className="user-menu-item">
                    <Icon name="sliders" size={15} /> {t('nav.settings')}
                  </Link>
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      signOut();
                      toast(t('auth.signedOut'));
                      navigate('/');
                    }}
                  >
                    <Icon name="logout" size={15} /> {t('common.signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/auth/signin" className="btn btn-ghost btn-sm">
                {t('common.signIn')}
              </Link>
              <Link to="/auth/signup" className="btn btn-primary btn-sm">
                {t('common.getStarted')}
              </Link>
            </div>
          )}
          <button className="nav-burger" onClick={() => setMenuOpen(true)} aria-label={t('nav.menu')}>
            <Icon name="menu" size={20} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label={t('nav.menu')}>
          <div className="mobile-menu-head">
            <Link to="/" className="nav-brand">
              <Logo size={26} />
              <span className="nav-wordmark">{t('common.appName')}</span>
            </Link>
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label={t('common.close')}>
              <Icon name="x" size={20} />
            </button>
          </div>
          <div className="mobile-menu-links">{links}</div>
          <div className="mobile-menu-foot">
            {langToggle}
            {user ? (
              <>
                <Link to="/settings" className="btn btn-ghost">
                  {t('nav.settings')}
                </Link>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    signOut();
                    toast(t('auth.signedOut'));
                    setMenuOpen(false);
                    navigate('/');
                  }}
                >
                  {t('common.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/signin" className="btn btn-outline">
                  {t('common.signIn')}
                </Link>
                <Link to="/auth/signup" className="btn btn-primary">
                  {t('common.getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────── Verify banner ───────────────────────────

export function VerifyBanner() {
  const { t, user, markVerified, toast } = useApp();
  if (!user || user.verified) return null;
  return (
    <div className="verify-banner" role="status">
      <Icon name="mail" size={15} />
      <span>{t('auth.verify.banner')}</span>
      <span className="verify-actions">
        <button onClick={() => toast(t('auth.verify.sentToast'), 'success')}>{t('auth.verify.resend')}</button>
        <button
          className="verify-primary"
          onClick={() => {
            markVerified();
            toast(t('auth.verify.doneToast'), 'success');
          }}
        >
          {t('auth.verify.done')}
        </button>
      </span>
    </div>
  );
}

// ─────────────────────────── Footer ───────────────────────────

export function Footer() {
  const { t, toast } = useApp();
  const [email, setEmail] = useState('');
  return (
    <footer className="footer">
      <div className="footer-card">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-brand">
              <Logo size={24} />
              <span className="nav-wordmark">{t('common.appName')}</span>
            </div>
            <a className="footer-contact" href="mailto:hello@circlebreaker.club">
              hello@circlebreaker.club
            </a>
            <p className="footer-mission">{t('footer.mission')}</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>{t('footer.product')}</h4>
              <Link to="/opportunities">{t('nav.opportunities')}</Link>
              <Link to="/resources">{t('nav.resources')}</Link>
              <Link to="/dashboard">{t('nav.dashboard')}</Link>
            </div>
            <div className="footer-col">
              <h4>{t('footer.company')}</h4>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/support">{t('footer.support')}</Link>
              <Link to="/privacy">{t('footer.privacy')}</Link>
              <Link to="/terms">{t('footer.terms')}</Link>
            </div>
          </div>
          <div className="footer-subscribe">
            <h4>{t('footer.subscribe')}</h4>
            <form
              className="subscribe-box"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return;
                setEmail('');
                toast(t('footer.subscribed'), 'success');
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.subscribePlaceholder')}
                aria-label={t('footer.subscribe')}
                required
              />
              <button type="submit" className="subscribe-btn" aria-label={t('footer.subscribe')}>
                <Icon name="arrowRight" size={14} strokeWidth={2} />
              </button>
            </form>
            <p className="footer-tagline">{t('common.tagline')}</p>
          </div>
        </div>
        <div className="footer-base">
          <span className="footer-socials" aria-hidden="true">
            <span className="social-dot">in</span>
            <span className="social-dot">𝕏</span>
            <span className="social-dot">wb</span>
          </span>
          <span className="footer-note">{t('common.prototypeNote')}</span>
          <span>{t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────── Route helpers ───────────────────────────

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location.pathname }} replace />;
  }
  return children;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

const TITLES: Record<string, string> = {
  '/': 'Circle Breaker — Your circle is not your ceiling',
  '/opportunities': 'Opportunities — Circle Breaker',
  '/resources': 'Resources — Circle Breaker',
  '/about': 'About — Circle Breaker',
  '/dashboard': 'Dashboard — Circle Breaker',
  '/settings': 'Settings — Circle Breaker',
  '/support': 'Support — Circle Breaker',
};

export function TitleManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? 'Circle Breaker';
  }, [pathname]);
  return null;
}
