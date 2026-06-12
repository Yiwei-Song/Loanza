import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DegreeLevel, ProgramType, Sector } from '../types';
import { DEGREE_LEVELS, INTEREST_SECTORS, PROGRAM_TYPES } from '../data/vocab';
import { useApp } from '../state/store';
import { CountrySingleSelect, Field, Icon, Modal } from '../components/ui';

const GENDERS = ['female', 'male', 'nonbinary', 'undisclosed'] as const;

export default function SettingsPage() {
  const { t, tv, lang, setLang, user, updateAccount, updateProfile, markVerified, setMember, deleteAccount, toast, saved } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [gender, setGender] = useState(user?.profile.gender);
  const [nationality, setNationality] = useState(user?.profile.nationality);
  const [residency, setResidency] = useState(user?.profile.residency);
  const [education, setEducation] = useState<DegreeLevel | undefined>(user?.profile.education);
  const [years, setYears] = useState<number>(user?.profile.experienceYears ?? 0);
  const [types, setTypes] = useState<ProgramType[]>(user?.profile.interestTypes ?? []);
  const [sectors, setSectors] = useState<Sector[]>(user?.profile.interestSectors ?? []);

  if (!user) return null;

  const saveAccount = () => {
    updateAccount({ name: name.trim() || user.name, email: email.trim() || user.email });
    toast(t('set.savedToast'), 'success');
  };

  const changePassword = () => {
    if (curPw !== user.password) {
      setPwError(t('set.password.wrong'));
      return;
    }
    if (newPw.length < 8) {
      setPwError(t('auth.err.shortPassword'));
      return;
    }
    updateAccount({ password: newPw });
    setCurPw('');
    setNewPw('');
    setPwError('');
    toast(t('set.password.changed'), 'success');
  };

  const saveProfile = () => {
    updateProfile({
      gender,
      nationality,
      residency,
      education,
      experienceYears: years,
      interestTypes: types,
      interestSectors: sectors,
    });
    toast(t('toast.profileSaved'), 'success');
  };

  const toggleType = (ty: ProgramType) =>
    setTypes((cur) => (cur.includes(ty) ? cur.filter((x) => x !== ty) : [...cur, ty]));
  const toggleSector = (s: Sector) =>
    setSectors((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <div className="page page-narrow set-page">
      <header className="page-header">
        <h1>{t('set.title')}</h1>
      </header>

      {/* ── account ── */}
      <section className="card set-card">
        <h2>
          <Icon name="user" size={16} strokeWidth={1.8} />
          {t('set.account')}
        </h2>
        <div className="set-grid2">
          <Field label={t('set.name')}>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label={t('set.email')}>
            <div className="email-field">
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {user.verified ? (
                <span className="chip chip-green">
                  <Icon name="check" size={11} strokeWidth={2.6} />
                  {t('set.verified')}
                </span>
              ) : (
                <span className="chip chip-orange">{t('set.unverified')}</span>
              )}
            </div>
          </Field>
        </div>
        {!user.verified && (
          <div className="row gap8 set-verify-row">
            <button className="btn btn-ghost btn-sm" onClick={() => toast(t('auth.verify.sentToast'), 'success')}>
              {t('set.resend')}
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                markVerified();
                toast(t('auth.verify.doneToast'), 'success');
              }}
            >
              {t('auth.verify.done')}
            </button>
          </div>
        )}
        <div className="set-actions">
          <button className="btn btn-primary" onClick={saveAccount}>
            {t('set.saveChanges')}
          </button>
        </div>

        <hr className="set-divider" />

        <h3 className="set-subhead">
          <Icon name="lock" size={14} strokeWidth={1.9} />
          {t('set.password')}
        </h3>
        <div className="set-grid2">
          <Field label={t('set.password.current')} error={pwError || undefined}>
            <input className="input" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} autoComplete="current-password" />
          </Field>
          <Field label={t('set.password.new')}>
            <input className="input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" />
          </Field>
        </div>
        <div className="set-actions">
          <button className="btn btn-outline" onClick={changePassword} disabled={!curPw || !newPw}>
            {t('set.password.change')}
          </button>
        </div>
      </section>

      {/* ── profile ── */}
      <section className="card set-card">
        <h2>
          <Icon name="compass" size={16} strokeWidth={1.8} />
          {t('set.profile')}
        </h2>
        <Field label={t('ob.gender')}>
          <div className="chip-row">
            {GENDERS.map((g) => (
              <button key={g} type="button" className={`chip chip-select ${gender === g ? 'on' : ''}`} aria-pressed={gender === g} onClick={() => setGender(g)}>
                {t(`ob.gender.${g}`)}
              </button>
            ))}
          </div>
        </Field>
        <div className="set-grid2">
          <Field label={t('ob.nationality')}>
            <CountrySingleSelect value={nationality} onChange={setNationality} placeholder={t('ob.selectCountry')} />
          </Field>
          <Field label={t('ob.residency')}>
            <CountrySingleSelect value={residency} onChange={setResidency} placeholder={t('ob.selectCountry')} />
          </Field>
        </div>
        <Field label={t('ob.education')}>
          <div className="chip-row">
            {DEGREE_LEVELS.filter((d) => d !== 'Open to all').map((d) => (
              <button key={d} type="button" className={`chip chip-select ${education === d ? 'on' : ''}`} aria-pressed={education === d} onClick={() => setEducation(d)}>
                {tv(d)}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t('ob.experience')}>
          <div className="years-control">
            <input type="range" min={0} max={20} value={years} onChange={(e) => setYears(Number(e.target.value))} aria-label={t('ob.experience')} />
            <span className="years-value">{t('ob.years', { n: years })}</span>
          </div>
        </Field>
        <Field label={t('ob.interests.types')} hint={t('ob.interests.types.hint')}>
          <div className="chip-row">
            {PROGRAM_TYPES.map((ty) => (
              <button key={ty} type="button" className={`chip chip-select ${types.includes(ty) ? 'on' : ''}`} aria-pressed={types.includes(ty)} onClick={() => toggleType(ty)}>
                {tv(ty)}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t('ob.interests.sectors')}>
          <div className="chip-row">
            {INTEREST_SECTORS.map((s) => (
              <button key={s} type="button" className={`chip chip-select ${sectors.includes(s) ? 'on' : ''}`} aria-pressed={sectors.includes(s)} onClick={() => toggleSector(s)}>
                {tv(s)}
              </button>
            ))}
          </div>
        </Field>
        <div className="set-actions">
          <button className="btn btn-primary" onClick={saveProfile}>
            {t('set.saveChanges')}
          </button>
        </div>
      </section>

      {/* ── membership ── */}
      <section className="card set-card">
        <h2>
          <Icon name="sparkle" size={15} />
          {t('set.membership')}
        </h2>
        <div className="membership-row">
          <div>
            <span className={`plan-chip ${user.member ? 'member' : ''}`}>
              {user.member ? t('common.member') : t('common.freePlan')}
            </span>
            <p className="membership-body">{user.member ? t('set.membership.memberBody') : t('set.membership.freeBody')}</p>
          </div>
          {user.member ? (
            <button
              className="btn btn-outline"
              onClick={() => {
                setMember(false);
                toast(t('up.downgraded'));
              }}
            >
              {t('set.membership.cancel')}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                setMember(true);
                toast(t('up.toast'), 'success');
              }}
            >
              <Icon name="sparkle" size={14} />
              {t('common.upgrade')}
            </button>
          )}
        </div>
        <p className="gate-note">{t('res.gate.note')}</p>
      </section>

      {/* ── language ── */}
      <section className="card set-card">
        <h2>
          <Icon name="globe" size={16} strokeWidth={1.8} />
          {t('set.language')}
        </h2>
        <div className="chip-row">
          <button className={`chip chip-select ${lang === 'en' ? 'on' : ''}`} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
            English
          </button>
          <button className={`chip chip-select ${lang === 'zh' ? 'on' : ''}`} aria-pressed={lang === 'zh'} onClick={() => setLang('zh')}>
            简体中文
          </button>
        </div>
      </section>

      {/* ── danger zone ── */}
      <section className="card set-card danger-card">
        <h2>
          <Icon name="alert" size={16} strokeWidth={1.8} />
          {t('set.danger')}
        </h2>
        <p className="membership-body">{t('set.danger.body')}</p>
        <button className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
          <Icon name="trash" size={15} strokeWidth={1.8} />
          {t('set.danger.cta')}
        </button>
      </section>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} label={t('set.danger.confirmTitle')} width={440}>
        <div className="confirm-modal">
          <div className="confirm-icon">
            <Icon name="alert" size={20} strokeWidth={1.7} />
          </div>
          <h3>{t('set.danger.confirmTitle')}</h3>
          <p>{t('set.danger.confirmBody', { n: saved.size })}</p>
          <div className="confirm-actions">
            <button className="btn btn-ghost" onClick={() => setConfirmOpen(false)}>
              {t('common.cancel')}
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setConfirmOpen(false);
                deleteAccount();
                toast(t('set.deleted'));
                navigate('/');
              }}
            >
              {t('set.danger.confirmCta')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
