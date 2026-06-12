import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../state/store';
import { Icon, Field, Logo } from '../components/ui';
import { WorldDots } from '../components/mapview';

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useApp();
  return (
    <div className="auth-layout">
      <aside className="auth-side">
        <Link to="/" className="nav-brand auth-brand">
          <Logo size={28} />
          <span className="nav-wordmark">{t('common.appName')}</span>
        </Link>
        <div className="auth-side-art">
          <WorldDots className="auth-world" />
        </div>
        <blockquote className="auth-quote">
          <p>{t('common.tagline')}</p>
          <footer>{t('footer.mission')}</footer>
        </blockquote>
      </aside>
      <main className="auth-main">{children}</main>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────── Sign in ───────────────────────────

export function SignInPage() {
  const { t, signIn, signInDemo, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError(t('auth.err.required'));
      return;
    }
    const result = signIn(email, password);
    if (result === 'wrong') {
      setError(t('auth.err.wrong'));
      return;
    }
    toast(t('auth.welcomeToast', { name: email.split('@')[0] }), 'success');
    navigate(from);
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1>{t('auth.signin.title')}</h1>
        <p className="auth-sub">{t('auth.signin.sub')}</p>
        <form onSubmit={submit} noValidate>
          <Field label={t('auth.email')}>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
          </Field>
          <Field label={t('auth.password')} error={error || undefined}>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          <div className="auth-row">
            <Link to="/auth/forgot" className="auth-link">
              {t('auth.forgot')}
            </Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {t('common.signIn')}
          </button>
        </form>
        <button
          className="btn btn-demo btn-block"
          onClick={() => {
            signInDemo();
            toast(t('auth.welcomeToast', { name: 'Amara' }), 'success');
            navigate('/dashboard');
          }}
        >
          <Icon name="sparkle" size={14} />
          <span className="btn-demo-text">
            {t('auth.demo')}
            <small>{t('auth.demo.hint')}</small>
          </span>
        </button>
        <p className="auth-switch">
          {t('auth.noAccount')}{' '}
          <Link to="/auth/signup" className="auth-link">
            {t('auth.createOne')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ─────────────────────────── Sign up ───────────────────────────

export function SignUpPage() {
  const { t, signUp, toast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = t('auth.err.required');
    if (!EMAIL_RE.test(email)) errs.email = t('auth.err.email');
    if (password.length < 8) errs.password = t('auth.err.shortPassword');
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const result = signUp(name, email, password);
    if (result === 'exists') {
      setErrors({ email: t('auth.err.exists') });
      return;
    }
    toast(t('auth.welcomeToast', { name: name.split(/\s+/)[0] }), 'success');
    navigate('/onboarding');
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1>{t('auth.signup.title')}</h1>
        <p className="auth-sub">{t('auth.signup.sub')}</p>
        <form onSubmit={submit} noValidate>
          <Field label={t('auth.name')} error={errors.name}>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />
          </Field>
          <Field label={t('auth.email')} error={errors.email}>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label={t('auth.password')} error={errors.password}>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </Field>
          <button type="submit" className="btn btn-primary btn-block">
            {t('common.signUp')}
          </button>
        </form>
        <p className="auth-switch">
          {t('auth.haveAccount')}{' '}
          <Link to="/auth/signin" className="auth-link">
            {t('common.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ─────────────────────────── Forgot password ───────────────────────────

export function ForgotPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(t('auth.err.email'));
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1>{t('auth.forgot.title')}</h1>
        <p className="auth-sub">{t('auth.forgot.sub')}</p>
        {!sent ? (
          <form onSubmit={submit} noValidate>
            <Field label={t('auth.email')} error={error || undefined}>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
            </Field>
            <button type="submit" className="btn btn-primary btn-block">
              {t('auth.forgot.cta')}
            </button>
          </form>
        ) : (
          <div className="auth-sent">
            <div className="auth-sent-icon">
              <Icon name="mail" size={20} strokeWidth={1.7} />
            </div>
            <p>{t('auth.forgot.sent', { email })}</p>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/auth/reset', { state: { email } })}>
              {t('auth.forgot.continue')}
              <Icon name="arrowRight" size={15} strokeWidth={2} />
            </button>
          </div>
        )}
        <p className="auth-switch">
          <Link to="/auth/signin" className="auth-link">
            <Icon name="arrowLeft" size={12} strokeWidth={2.2} /> {t('common.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

// ─────────────────────────── Reset password ───────────────────────────

export function ResetPage() {
  const { t, resetPassword, emailExists, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const presetEmail = (location.state as { email?: string } | null)?.email ?? '';

  const [email, setEmail] = useState(presetEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!EMAIL_RE.test(email)) errs.email = t('auth.err.email');
    else if (!emailExists(email)) errs.email = t('auth.err.noUser');
    if (password.length < 8) errs.password = t('auth.err.shortPassword');
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    resetPassword(email, password);
    toast(t('auth.reset.done'), 'success');
    navigate('/auth/signin');
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1>{t('auth.reset.title')}</h1>
        <form onSubmit={submit} noValidate>
          <Field label={t('auth.email')} error={errors.email}>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label={t('set.password.new')} error={errors.password}>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" autoFocus={Boolean(presetEmail)} />
          </Field>
          <button type="submit" className="btn btn-primary btn-block">
            {t('auth.reset.cta')}
          </button>
        </form>
        <p className="auth-switch">
          <Link to="/auth/signin" className="auth-link">
            <Icon name="arrowLeft" size={12} strokeWidth={2.2} /> {t('common.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
