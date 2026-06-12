import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Filters } from '../lib/filtering';
import { DEFAULT_FILTERS, availableCities, availableCountries } from '../lib/filtering';
import { DELIVERY_MODES, DURATIONS, FUNDING_TYPES, PROGRAM_TYPES, REGIONS, SECTORS } from '../data/vocab';
import { OPPORTUNITIES } from '../data/opportunities';
import { countryName } from '../data/countries';
import { monthRange, formatMonth } from '../lib/dates';
import { useApp } from '../state/store';
import { profileChecklist } from '../lib/eligibility';
import { CountryMultiSelect, DualRange, Icon, Segmented, Toggle } from './ui';

export const MONTH_DOMAIN = monthRange('2026-01', '2028-06');

function Section({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <section className="filter-section">
      <h4 className="filter-title">
        {title}
        {badge ? <span className="filter-badge">{badge}</span> : null}
      </h4>
      {children}
    </section>
  );
}

function CheckList({
  options,
  selected,
  onToggle,
  labelOf,
  limit = 6,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  labelOf: (v: string) => string;
  limit?: number;
}) {
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, limit);
  return (
    <div className="checklist">
      {visible.map((opt) => {
        const on = selected.includes(opt);
        return (
          <label key={opt} className={`checkrow ${on ? 'on' : ''}`}>
            <input type="checkbox" checked={on} onChange={() => onToggle(opt)} />
            <span className="checkbox-box">{on && <Icon name="check" size={11} strokeWidth={3} />}</span>
            <span className="checkrow-label">{labelOf(opt)}</span>
          </label>
        );
      })}
      {options.length > limit && (
        <button className="checklist-more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? t('db.lessOptions') : t('db.moreOptions', { n: options.length })}
          <Icon name="chevronDown" size={12} strokeWidth={2.2} className={expanded ? 'rot180' : ''} />
        </button>
      )}
    </div>
  );
}

function MonthRangeControl({
  from,
  to,
  onChange,
  ariaLabel,
}: {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  ariaLabel: string;
}) {
  const { lang } = useApp();
  const max = MONTH_DOMAIN.length - 1;
  const lo = from ? Math.max(0, MONTH_DOMAIN.indexOf(from)) : 0;
  const hi = to ? Math.max(0, MONTH_DOMAIN.indexOf(to)) : max;
  return (
    <DualRange
      min={0}
      max={max}
      lo={lo}
      hi={hi}
      ariaLabel={ariaLabel}
      formatValue={(i) => formatMonth(MONTH_DOMAIN[i], lang)}
      onChange={(nlo, nhi) =>
        onChange(nlo === 0 ? null : MONTH_DOMAIN[nlo], nhi === max ? null : MONTH_DOMAIN[nhi])
      }
    />
  );
}

export function FilterPanel({
  filters,
  setFilters,
  onClose,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose?: () => void;
}) {
  const { t, tv, lang, user, lens, setLens } = useApp();

  const toggleIn = (key: 'types' | 'modes' | 'funding' | 'sectors' | 'countries' | 'cities') => (v: string) => {
    const list = filters[key];
    const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
    setFilters({ ...filters, [key]: next });
  };

  const countriesAvail = useMemo(() => {
    const codes = availableCountries(OPPORTUNITIES, filters.region);
    return codes.sort((a, b) => countryName(a, lang).localeCompare(countryName(b, lang)));
  }, [filters.region, lang]);

  const citiesAvail = useMemo(
    () => availableCities(OPPORTUNITIES, filters.region, filters.countries),
    [filters.region, filters.countries],
  );

  const profile = user?.profile ?? null;
  const profileOk = profile ? profileChecklist(profile).complete : false;
  const remoteOnly = filters.modes.length === 1 && filters.modes[0] === 'Remote';

  return (
    <div className="filter-panel">
      <div className="filter-panel-head">
        <h3>
          <Icon name="sliders" size={16} strokeWidth={1.9} />
          {t('db.filters')}
        </h3>
        <div className="row gap8">
          <button
            className="filter-clear"
            onClick={() => {
              setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
              setLens([]);
            }}
          >
            {t('common.clearAll')}
          </button>
          {onClose && (
            <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
              <Icon name="x" size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Eligibility lens — the signature feature */}
      <section className="filter-section lens-section">
        <h4 className="filter-title lens-title">
          <Icon name="compass" size={15} strokeWidth={1.9} />
          {t('db.lens')}
        </h4>
        <p className="lens-hint">{t('db.lens.hint')}</p>
        <CountryMultiSelect selected={lens} onChange={setLens} placeholder={t('db.lens.placeholder')} />
        <div className="lens-match">
          <div className="lens-match-text">
            <span className="lens-match-label">{t('db.matchProfile')}</span>
            {!user && (
              <Link to="/auth/signin" className="lens-match-sub">
                {t('db.matchProfile.signin')}
              </Link>
            )}
            {user && !profileOk && (
              <Link to="/onboarding" className="lens-match-sub">
                {t('db.matchProfile.incomplete')}
              </Link>
            )}
          </div>
          <Toggle
            checked={filters.matchProfile}
            disabled={!user || !profileOk}
            onChange={(v) => setFilters({ ...filters, matchProfile: v })}
            label={t('db.matchProfile')}
          />
        </div>
      </section>

      <Section title={t('common.deadline')}>
        <Segmented
          small
          ariaLabel={t('common.deadline')}
          options={[
            { key: 'open' as const, label: t('db.mode.open') },
            { key: 'all' as const, label: t('db.mode.all') },
          ]}
          value={filters.openMode}
          onChange={(v) => setFilters({ ...filters, openMode: v, dueFrom: null, dueTo: null })}
        />
        {filters.openMode === 'all' && (
          <div className="filter-subblock">
            <span className="filter-sublabel">{t('db.dueWindow')}</span>
            <MonthRangeControl
              from={filters.dueFrom}
              to={filters.dueTo}
              ariaLabel={t('db.dueWindow')}
              onChange={(f, tt) => setFilters({ ...filters, dueFrom: f, dueTo: tt })}
            />
          </div>
        )}
        <label className="checkrow standalone">
          <input
            type="checkbox"
            checked={filters.savedOnly}
            onChange={() => setFilters({ ...filters, savedOnly: !filters.savedOnly })}
          />
          <span className="checkbox-box">{filters.savedOnly && <Icon name="check" size={11} strokeWidth={3} />}</span>
          <span className="checkrow-label">
            <Icon name="bookmark" size={12} strokeWidth={2} /> {t('db.savedOnly')}
          </span>
        </label>
      </Section>

      <Section title={t('db.type')} badge={filters.types.length}>
        <CheckList options={PROGRAM_TYPES} selected={filters.types} onToggle={toggleIn('types')} labelOf={tv} />
      </Section>

      <Section title={t('db.deliveryMode')} badge={filters.modes.length}>
        <CheckList options={DELIVERY_MODES} selected={filters.modes} onToggle={toggleIn('modes')} labelOf={tv} limit={3} />
      </Section>

      <Section title={t('db.location')} badge={(filters.region ? 1 : 0) + filters.countries.length + filters.cities.length}>
        {remoteOnly ? (
          <p className="filter-note">
            <Icon name="info" size={13} strokeWidth={2} /> {t('db.remoteNote')}
          </p>
        ) : (
          <>
            <select
              className="select"
              value={filters.region ?? ''}
              aria-label={t('db.region')}
              onChange={(e) =>
                setFilters({ ...filters, region: e.target.value || null, countries: [], cities: [] })
              }
            >
              <option value="">{t('db.anyRegion')}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {tv(r)}
                </option>
              ))}
            </select>
            {countriesAvail.length > 0 && (
              <div className="filter-subblock">
                <span className="filter-sublabel">{t('db.country')}</span>
                <CheckList
                  options={countriesAvail}
                  selected={filters.countries}
                  onToggle={(c) => {
                    const next = filters.countries.includes(c)
                      ? filters.countries.filter((x) => x !== c)
                      : [...filters.countries, c];
                    setFilters({ ...filters, countries: next, cities: [] });
                  }}
                  labelOf={(c) => countryName(c, lang)}
                  limit={5}
                />
              </div>
            )}
            {citiesAvail.length > 0 && (filters.countries.length > 0 || filters.region) && (
              <div className="filter-subblock">
                <span className="filter-sublabel">{t('db.city')}</span>
                <CheckList options={citiesAvail} selected={filters.cities} onToggle={toggleIn('cities')} labelOf={(c) => c} limit={5} />
              </div>
            )}
          </>
        )}
      </Section>

      <Section title={t('db.funding')} badge={filters.funding.length}>
        <CheckList options={FUNDING_TYPES} selected={filters.funding} onToggle={toggleIn('funding')} labelOf={tv} limit={5} />
      </Section>

      <Section title={t('db.sector')} badge={filters.sectors.length}>
        <CheckList options={SECTORS} selected={filters.sectors} onToggle={toggleIn('sectors')} labelOf={tv} />
      </Section>

      <Section title={t('db.duration')}>
        <DualRange
          min={0}
          max={DURATIONS.length - 1}
          lo={filters.durMin}
          hi={filters.durMax}
          ariaLabel={t('db.duration')}
          formatValue={(i) => tv(DURATIONS[i])}
          onChange={(lo, hi) => setFilters({ ...filters, durMin: lo, durMax: hi })}
        />
      </Section>

      <Section title={t('db.programDates')}>
        <MonthRangeControl
          from={filters.progFrom}
          to={filters.progTo}
          ariaLabel={t('db.programDates')}
          onChange={(f, tt) => setFilters({ ...filters, progFrom: f, progTo: tt })}
        />
        <div className="filter-toggle-row">
          <span>{t('db.includeUndated')}</span>
          <Toggle
            checked={filters.includeUndated}
            onChange={(v) => setFilters({ ...filters, includeUndated: v })}
            label={t('db.includeUndated')}
          />
        </div>
      </Section>
    </div>
  );
}
