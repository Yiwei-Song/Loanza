import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { DegreeLevel, ProgramType, Sector } from '../types';
import { DEGREE_LEVELS, INTEREST_SECTORS, PROGRAM_TYPES } from '../data/vocab';
import { useApp } from '../state/store';
import { CountrySingleSelect, Field, Icon, Logo } from '../components/ui';

const GENDERS = ['female', 'male', 'nonbinary', 'undisclosed'] as const;

export default function OnboardingPage() {
  const { t, tv, user, updateProfile, toast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [gender, setGender] = useState(user?.profile.gender);
  const [nationality, setNationality] = useState(user?.profile.nationality);
  const [residency, setResidency] = useState(user?.profile.residency);
  const [education, setEducation] = useState<DegreeLevel | undefined>(user?.profile.education);
  const [years, setYears] = useState<number>(user?.profile.experienceYears ?? 0);
  const [types, setTypes] = useState<ProgramType[]>(user?.profile.interestTypes ?? []);
  const [sectors, setSectors] = useState<Sector[]>(user?.profile.interestSectors ?? []);

  if (!user) return null;

  const steps = [t('ob.step1'), t('ob.step2'), t('ob.step3'), t('ob.step4')];

  const saveStep = (s: number) => {
    if (s === 0) updateProfile({ gender, nationality, residency });
    if (s === 1) updateProfile({ education, experienceYears: years });
    if (s === 2) {
      updateProfile({ interestTypes: types, interestSectors: sectors });
      toast(t('toast.profileSaved'), 'success');
    }
  };

  const next = () => {
    saveStep(step);
    setStep((s) => Math.min(3, s + 1));
  };

  const toggleType = (ty: ProgramType) =>
    setTypes((cur) => (cur.includes(ty) ? cur.filter((x) => x !== ty) : [...cur, ty]));
  const toggleSector = (s: Sector) =>
    setSectors((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <div className="page page-narrow ob-page">
      <header className="ob-head">
        <h1>{t('ob.title')}</h1>
        <p>{t('ob.sub')}</p>
        <div className="stepper" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={4}>
          {steps.map((label, i) => (
            <div key={label} className={`step ${i === step ? 'current' : ''} ${i < step ? 'done' : ''}`}>
              <span className="step-dot">{i < step ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}</span>
              <span className="step-label">{label}</span>
              {i < steps.length - 1 && <span className="step-bar" />}
            </div>
          ))}
        </div>
      </header>

      <div className="card ob-card">
        {step === 0 && (
          <div className="ob-step">
            <Field label={t('ob.gender')}>
              <div className="chip-row">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`chip chip-select ${gender === g ? 'on' : ''}`}
                    aria-pressed={gender === g}
                    onClick={() => setGender(g)}
                  >
                    {t(`ob.gender.${g}`)}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t('ob.nationality')}>
              <CountrySingleSelect value={nationality} onChange={setNationality} placeholder={t('ob.selectCountry')} />
            </Field>
            <Field label={t('ob.residency')}>
              <CountrySingleSelect value={residency} onChange={setResidency} placeholder={t('ob.selectCountry')} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="ob-step">
            <Field label={t('ob.education')}>
              <div className="chip-row">
                {DEGREE_LEVELS.filter((d) => d !== 'Open to all').map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`chip chip-select ${education === d ? 'on' : ''}`}
                    aria-pressed={education === d}
                    onClick={() => setEducation(d)}
                  >
                    {tv(d)}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t('ob.experience')}>
              <div className="years-control">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  aria-label={t('ob.experience')}
                />
                <span className="years-value">{t('ob.years', { n: years })}</span>
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step">
            <Field label={t('ob.interests.types')} hint={t('ob.interests.types.hint')}>
              <div className="chip-row">
                {PROGRAM_TYPES.map((ty) => (
                  <button
                    key={ty}
                    type="button"
                    className={`chip chip-select ${types.includes(ty) ? 'on' : ''}`}
                    aria-pressed={types.includes(ty)}
                    onClick={() => toggleType(ty)}
                  >
                    {tv(ty)}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t('ob.interests.sectors')}>
              <div className="chip-row">
                {INTEREST_SECTORS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip chip-select ${sectors.includes(s) ? 'on' : ''}`}
                    aria-pressed={sectors.includes(s)}
                    onClick={() => toggleSector(s)}
                  >
                    {tv(s)}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="ob-done">
            <div className="ob-done-mark">
              <Logo size={52} />
            </div>
            <h2>{t('ob.done.title')}</h2>
            <p>{t('ob.done.body')}</p>
            <div className="ob-done-actions">
              <Link to="/opportunities?match=1" className="btn btn-primary">
                <Icon name="compass" size={15} strokeWidth={1.9} />
                {t('ob.done.match')}
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                {t('ob.done.dash')}
              </Link>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="ob-foot">
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
              {t('common.skip')}
            </button>
            <div className="row gap8">
              {step > 0 && (
                <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                  <Icon name="arrowLeft" size={14} strokeWidth={2} />
                  {t('common.back')}
                </button>
              )}
              <button className="btn btn-primary" onClick={next}>
                {t('common.next')}
                <Icon name="arrowRight" size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
