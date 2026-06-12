import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OPPORTUNITIES } from '../data/opportunities';
import { DURATIONS, PROGRAM_TYPES, REGIONS, SECTORS } from '../data/vocab';
import { applyFilters, countActiveFilters, DEFAULT_FILTERS, type Filters, type SortKey, type ViewKey } from '../lib/filtering';
import { profileChecklist } from '../lib/eligibility';
import { useApp } from '../state/store';
import { EmptyState, Icon, Segmented, SkeletonCard } from '../components/ui';
import { OpportunityCard, OpportunityRow } from '../components/opportunity';
import { MapView } from '../components/mapview';
import { FilterPanel } from '../components/filters';
import { countryName } from '../data/countries';
import { formatMonth } from '../lib/dates';

export default function DatabasePage() {
  const { t, tv, lang, user, saved, lens, setLens } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() => {
    const f = { ...DEFAULT_FILTERS };
    const type = searchParams.get('type');
    if (type && (PROGRAM_TYPES as string[]).includes(type)) f.types = [type];
    const sector = searchParams.get('sector');
    if (sector && (SECTORS as string[]).includes(sector)) f.sectors = [sector];
    const region = searchParams.get('region');
    if (region && (REGIONS as string[]).includes(region)) f.region = region;
    if (searchParams.get('saved') === '1') f.savedOnly = true;
    if (searchParams.get('match') === '1') f.matchProfile = true;
    const q = searchParams.get('q');
    if (q) f.q = q;
    return f;
  });
  const [view, setView] = useState<ViewKey>(() => {
    const v = searchParams.get('view');
    return v === 'list' || v === 'map' ? v : 'gallery';
  });
  const [phase, setPhase] = useState<'loading' | 'error' | 'ready'>('loading');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const simulateError = searchParams.get('state') === 'error';

  useEffect(() => {
    setPhase('loading');
    const timer = window.setTimeout(() => setPhase(simulateError ? 'error' : 'ready'), simulateError ? 700 : 650);
    return () => window.clearTimeout(timer);
  }, [simulateError]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const profile = user?.profile ?? null;
  const profileComplete = profile ? profileChecklist(profile).complete : false;

  const results = useMemo(
    () => applyFilters(OPPORTUNITIES, filters, { saved, lens, profile, profileComplete }),
    [filters, saved, lens, profile, profileComplete],
  );

  const activeCount = countActiveFilters(filters) + (lens.length ? 1 : 0);

  // Active filter chips
  const chips: { label: string; onRemove: () => void }[] = [];
  for (const ty of filters.types)
    chips.push({ label: tv(ty), onRemove: () => setFilters({ ...filters, types: filters.types.filter((x) => x !== ty) }) });
  for (const m of filters.modes)
    chips.push({ label: tv(m), onRemove: () => setFilters({ ...filters, modes: filters.modes.filter((x) => x !== m) }) });
  if (filters.region)
    chips.push({ label: tv(filters.region), onRemove: () => setFilters({ ...filters, region: null, countries: [], cities: [] }) });
  for (const c of filters.countries)
    chips.push({ label: countryName(c, lang), onRemove: () => setFilters({ ...filters, countries: filters.countries.filter((x) => x !== c), cities: [] }) });
  for (const c of filters.cities)
    chips.push({ label: c, onRemove: () => setFilters({ ...filters, cities: filters.cities.filter((x) => x !== c) }) });
  for (const f of filters.funding)
    chips.push({ label: tv(f), onRemove: () => setFilters({ ...filters, funding: filters.funding.filter((x) => x !== f) }) });
  for (const s of filters.sectors)
    chips.push({ label: tv(s), onRemove: () => setFilters({ ...filters, sectors: filters.sectors.filter((x) => x !== s) }) });
  if (filters.durMin > 0 || filters.durMax < DURATIONS.length - 1)
    chips.push({
      label: `${tv(DURATIONS[filters.durMin])} – ${tv(DURATIONS[filters.durMax])}`,
      onRemove: () => setFilters({ ...filters, durMin: 0, durMax: DURATIONS.length - 1 }),
    });
  if (filters.dueFrom || filters.dueTo)
    chips.push({
      label: `${t('db.dueWindow')}: ${filters.dueFrom ? formatMonth(filters.dueFrom, lang) : '…'} – ${filters.dueTo ? formatMonth(filters.dueTo, lang) : '…'}`,
      onRemove: () => setFilters({ ...filters, dueFrom: null, dueTo: null }),
    });
  if (filters.progFrom || filters.progTo)
    chips.push({
      label: `${t('db.programDates')}: ${filters.progFrom ? formatMonth(filters.progFrom, lang) : '…'} – ${filters.progTo ? formatMonth(filters.progTo, lang) : '…'}`,
      onRemove: () => setFilters({ ...filters, progFrom: null, progTo: null }),
    });
  if (!filters.includeUndated)
    chips.push({ label: t('db.includeUndated'), onRemove: () => setFilters({ ...filters, includeUndated: true }) });
  if (filters.savedOnly)
    chips.push({ label: t('db.savedOnly'), onRemove: () => setFilters({ ...filters, savedOnly: false }) });
  if (filters.matchProfile)
    chips.push({ label: t('db.matchProfile'), onRemove: () => setFilters({ ...filters, matchProfile: false }) });
  for (const code of lens)
    chips.push({ label: `${t('db.lens')}: ${countryName(code, lang)}`, onRemove: () => setLens(lens.filter((x) => x !== code)) });

  const clearEverything = () => {
    setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
    setLens([]);
  };

  const emptyVariant = filters.savedOnly ? 'saved' : filters.q.trim() ? 'search' : 'filters';

  return (
    <div className="page db-page">
      <header className="db-header">
        <div className="db-header-text">
          <h1>{t('db.title')}</h1>
          <p>{t('db.sub')}</p>
        </div>
        <div className="db-toolbar">
          <div className="searchbox">
            <Icon name="search" size={16} strokeWidth={1.9} />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder={t('db.searchPlaceholder')}
              aria-label={t('common.search')}
            />
            {filters.q && (
              <button className="searchbox-clear" onClick={() => setFilters({ ...filters, q: '' })} aria-label={t('common.clear')}>
                <Icon name="x" size={13} strokeWidth={2.2} />
              </button>
            )}
          </div>
          <Segmented<ViewKey>
            ariaLabel={t('db.view.gallery')}
            options={[
              { key: 'gallery', label: <><Icon name="grid" size={15} strokeWidth={1.8} /><span className="seg-text">{t('db.view.gallery')}</span></>, title: t('db.view.gallery') },
              { key: 'list', label: <><Icon name="list" size={15} strokeWidth={1.8} /><span className="seg-text">{t('db.view.list')}</span></>, title: t('db.view.list') },
              { key: 'map', label: <><Icon name="map" size={15} strokeWidth={1.8} /><span className="seg-text">{t('db.view.map')}</span></>, title: t('db.view.map') },
            ]}
            value={view}
            onChange={setView}
          />
          <select
            className="select select-sort"
            value={filters.sort}
            aria-label={t('db.sort')}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}
          >
            <option value="soonest">{t('db.sort.soonest')}</option>
            <option value="latest">{t('db.sort.latest')}</option>
            <option value="recent">{t('db.sort.recent')}</option>
          </select>
          <button className="btn btn-outline db-filter-btn" onClick={() => setDrawerOpen(true)}>
            <Icon name="sliders" size={15} strokeWidth={1.9} />
            {t('db.filters')}
            {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
          </button>
        </div>
      </header>

      <div className="db-body">
        <aside className="db-aside">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        {drawerOpen && (
          <div className="db-drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setDrawerOpen(false)}>
            <div className="db-drawer" role="dialog" aria-label={t('db.filters')}>
              <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setDrawerOpen(false)} />
              <div className="db-drawer-foot">
                <button className="btn btn-primary btn-block" onClick={() => setDrawerOpen(false)}>
                  {phase === 'ready' ? t('db.results', { n: results.length }) : t('db.filters')}
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="db-main">
          <div className="db-results-bar">
            <span className="db-count" aria-live="polite">
              {phase === 'ready' ? (results.length === 1 ? t('db.result') : t('db.results', { n: results.length })) : '…'}
            </span>
            {chips.length > 0 && (
              <div className="db-chips">
                {chips.map((c, i) => (
                  <span key={i} className="chip chip-filter">
                    {c.label}
                    <button onClick={c.onRemove} aria-label={`${t('common.clear')} ${c.label}`}>
                      <Icon name="x" size={11} strokeWidth={2.4} />
                    </button>
                  </span>
                ))}
                <button className="chip-clear-all" onClick={clearEverything}>
                  {t('common.clearAll')}
                </button>
              </div>
            )}
          </div>

          {phase === 'loading' && (
            <div className="opp-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
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

          {phase === 'ready' && results.length === 0 && (
            <EmptyState
              icon={emptyVariant === 'saved' ? 'bookmark' : emptyVariant === 'search' ? 'search' : 'sliders'}
              title={t(`db.empty.${emptyVariant}.title`)}
              body={t(`db.empty.${emptyVariant}.body`)}
              action={
                <button className="btn btn-primary" onClick={clearEverything}>
                  {t('db.empty.clear')}
                </button>
              }
            />
          )}

          {phase === 'ready' && results.length > 0 && view === 'gallery' && (
            <div className="opp-grid">
              {results.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} reveal />
              ))}
            </div>
          )}

          {phase === 'ready' && results.length > 0 && view === 'list' && (
            <div className="opp-list">
              {results.map((opp) => (
                <OpportunityRow key={opp.id} opp={opp} />
              ))}
            </div>
          )}

          {phase === 'ready' && results.length > 0 && view === 'map' && (
            <MapView opportunities={results} onShowList={() => setView('list')} />
          )}
        </main>
      </div>
    </div>
  );
}
