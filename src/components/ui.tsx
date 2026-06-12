import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { COUNTRIES, countryName, searchCountries } from '../data/countries';
import { useApp } from '../state/store';

// ─────────────────────────── Icons ───────────────────────────

type IconDef = { paths: string[]; fills?: string[] };

const ICONS: Record<string, IconDef> = {
  search: { paths: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M16.2 16.2 21 21'] },
  bookmark: { paths: ['M7 4h10a1 1 0 0 1 1 1v15.4l-6-4.3-6 4.3V5a1 1 0 0 1 1-1z'] },
  pin: { paths: ['M12 21.5S5 16 5 10.2A7 7 0 0 1 19 10.2C19 16 12 21.5 12 21.5z', 'M12 12.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z'] },
  calendar: { paths: ['M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z', 'M4 10.5h16', 'M8.5 3v4', 'M15.5 3v4'] },
  clock: { paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7.5V12l3.2 2'] },
  globe: { paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M3.5 9.5h17', 'M3.5 14.5h17', 'M12 3c2.4 2.6 3.8 5.5 3.8 9S14.4 18.4 12 21c-2.4-2.6-3.8-5.5-3.8-9S9.6 5.6 12 3z'] },
  arrowUpRight: { paths: ['M7 17 17 7', 'M8.5 7H17v8.5'] },
  arrowRight: { paths: ['M4 12h15', 'M13 5.5l6.5 6.5-6.5 6.5'] },
  arrowLeft: { paths: ['M20 12H5', 'M11 5.5 4.5 12l6.5 6.5'] },
  chevronDown: { paths: ['m6 9.5 6 6 6-6'] },
  check: { paths: ['m5 12.5 4.7 4.7L19 7'] },
  x: { paths: ['M6 6l12 12', 'M18 6 6 18'] },
  filter: { paths: ['M4 6.5h16', 'M7 12h10', 'M10 17.5h4'] },
  grid: { paths: ['M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4z', 'M13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4A1.5 1.5 0 0 1 18.5 11h-4A1.5 1.5 0 0 1 13 9.5v-4z', 'M4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4z', 'M13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4z'] },
  list: { paths: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4.5 6h.01', 'M4.5 12h.01', 'M4.5 18h.01'] },
  map: { paths: ['M9 4 3.5 5.8v14L9 18l6 1.8 5.5-1.8v-14L15 5.8 9 4z', 'M9 4v14', 'M15 5.8v14'] },
  user: { paths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 20.5c.9-3.8 4-5.7 8-5.7s7.1 1.9 8 5.7'] },
  sliders: { paths: ['M4 7h16', 'M4 17h16', 'M10 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M14 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'] },
  logout: { paths: ['M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3', 'M16 16.5 20.5 12 16 7.5', 'M20.5 12H9'] },
  share: { paths: ['M6.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M17.5 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M17.5 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'm8.8 10.8 6.4-3.6', 'm8.8 13.2 6.4 3.6'] },
  mail: { paths: ['M3.5 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7z', 'm4 7.5 8 5.5 8-5.5'] },
  lock: { paths: ['M5.5 11.5a1.5 1.5 0 0 1 1.5-1.5h10a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 17 20H7a1.5 1.5 0 0 1-1.5-1.5v-7z', 'M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10'] },
  alert: { paths: ['M12 3.5 2.8 19.5h18.4L12 3.5z', 'M12 10v4', 'M12 16.8h.01'] },
  plus: { paths: ['M12 5v14', 'M5 12h14'] },
  minus: { paths: ['M5 12h14'] },
  menu: { paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  banknote: { paths: ['M3 8.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5v-7z', 'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M6.2 12h.01', 'M17.8 12h.01'] },
  layers: { paths: ['m12 3.5 8.5 4.7L12 12.9 3.5 8.2 12 3.5z', 'm3.5 12.5 8.5 4.7 8.5-4.7', 'm3.5 16.5 8.5 4.7 8.5-4.7'] },
  briefcase: { paths: ['M3.5 9.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9z', 'M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5'] },
  cap: { paths: ['M12 4.5 2.5 9.2 12 13.9l9.5-4.7L12 4.5z', 'M6.2 11.4v4.4c0 1.6 2.8 3.1 5.8 3.1s5.8-1.5 5.8-3.1v-4.4', 'M21.5 9.2v5'] },
  eye: { paths: ['M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'] },
  copy: { paths: ['M9.5 9.5A1.5 1.5 0 0 1 11 8h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 20h-8a1.5 1.5 0 0 1-1.5-1.5v-9z', 'M5.5 15H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 3h8a1.5 1.5 0 0 1 1.5 1.5V5'] },
  info: { paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5.5', 'M12 7.8h.01'] },
  trash: { paths: ['M4 7h16', 'M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7', 'm6 7 .9 12a2 2 0 0 0 2 1.9h6.2a2 2 0 0 0 2-1.9L18 7'] },
  compass: { paths: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'm15.5 8.5-2 5-5 2 2-5 5-2z'] },
  sparkle: { paths: [], fills: ['M12 2.4c.95 4.83 2.52 6.4 7.35 7.35-4.83.95-6.4 2.52-7.35 7.35-.95-4.83-2.52-6.4-7.35-7.35 4.83-.95 6.4-2.52 7.35-7.35z'] },
  bookmarkFill: { paths: [], fills: ['M7 4h10a1 1 0 0 1 1 1v15.4l-6-4.3-6 4.3V5a1 1 0 0 1 1-1z'] },
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.7,
  className,
}: {
  name: keyof typeof ICONS;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const def = ICONS[name];
  if (!def) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {def.paths.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {def.fills?.map((d, i) => (
        <path key={`f${i}`} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}

// ─────────────────────────── Logo ───────────────────────────

export function Logo({ size = 28, spark = true }: { size?: number; spark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true" className="logo-mark">
      <path
        d="M 20.76 8.66 A 11 11 0 1 0 27.34 15.24"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {spark && (
        <path
          d="M29 2.6 Q29.9 6.1 33.4 7 Q29.9 7.9 29 11.4 Q28.1 7.9 24.6 7 Q28.1 6.1 29 2.6 Z"
          fill="var(--violet, #837CF2)"
          className="logo-spark"
        />
      )}
    </svg>
  );
}

// ─────────────────────────── Modal ───────────────────────────

export function Modal({
  open,
  onClose,
  children,
  width = 460,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // move focus into the dialog
    const t = window.setTimeout(() => ref.current?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────── Toast host ───────────────────────────

export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={`toast toast-${t.tone}`} onClick={() => dismissToast(t.id)}>
          {t.tone === 'success' && <Icon name="check" size={15} />}
          {t.tone === 'error' && <Icon name="alert" size={15} />}
          <span>{t.message}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────── Skeletons / empty states ───────────────────────────

export function Skeleton({ w, h = 14, r = 8, className }: { w?: number | string; h?: number; r?: number; className?: string }) {
  return <span className={`skeleton ${className ?? ''}`} style={{ width: w ?? '100%', height: h, borderRadius: r }} />;
}

export function SkeletonCard() {
  return (
    <div className="card opp-card skeleton-card" aria-hidden="true">
      <div className="row gap8">
        <Skeleton w={92} h={24} r={99} />
        <span style={{ flex: 1 }} />
        <Skeleton w={32} h={32} r={12} />
      </div>
      <Skeleton w="82%" h={20} />
      <Skeleton w="58%" h={13} />
      <div style={{ height: 4 }} />
      <Skeleton w="100%" h={12} />
      <Skeleton w="88%" h={12} />
      <div style={{ height: 8 }} />
      <div className="row gap8">
        <Skeleton w={110} h={26} r={99} />
        <Skeleton w={90} h={26} r={99} />
      </div>
    </div>
  );
}

export function EmptyState({
  icon = 'compass',
  title,
  body,
  action,
}: {
  icon?: keyof typeof ICONS;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-ring">
        <Icon name={icon} size={26} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

// ─────────────────────────── Progress ring ───────────────────────────

export function ProgressRing({ percent, size = 84, stroke = 7 }: { percent: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, percent)) / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring" role="img" aria-label={`${percent}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-strong)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--violet)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="progress-ring-fg"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="progress-ring-text">
        {percent}%
      </text>
    </svg>
  );
}

// ─────────────────────────── Segmented control ───────────────────────────

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  small,
  ariaLabel,
}: {
  options: { key: T; label: React.ReactNode; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
  ariaLabel?: string;
}) {
  return (
    <div className={`segmented ${small ? 'segmented-sm' : ''}`} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.key}
          role="tab"
          aria-selected={value === o.key}
          title={o.title}
          className={`segmented-btn ${value === o.key ? 'active' : ''}`}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────── Toggle switch ───────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`switch ${checked ? 'on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-knob" />
    </button>
  );
}

// ─────────────────────────── Dual range slider ───────────────────────────

export function DualRange({
  min,
  max,
  lo,
  hi,
  onChange,
  formatValue,
  ariaLabel,
}: {
  min: number;
  max: number;
  lo: number;
  hi: number;
  onChange: (lo: number, hi: number) => void;
  formatValue: (v: number) => string;
  ariaLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'lo' | 'hi' | null>(null);

  const valueFromX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return min;
      const rect = el.getBoundingClientRect();
      const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return Math.round(min + frac * (max - min));
    },
    [min, max],
  );

  const startDrag = (which: 'lo' | 'hi') => (e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = which;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const v = valueFromX(e.clientX);
    if (dragging.current === 'lo') onChange(Math.min(v, hi), hi);
    else onChange(lo, Math.max(v, lo));
  };

  const endDrag = () => {
    dragging.current = null;
  };

  const onTrackDown = (e: React.PointerEvent) => {
    const v = valueFromX(e.clientX);
    // move whichever handle is closer
    if (Math.abs(v - lo) <= Math.abs(v - hi)) onChange(Math.min(v, hi), hi);
    else onChange(lo, Math.max(v, lo));
  };

  const key = (which: 'lo' | 'hi') => (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 1;
    if (e.key === 'Home') delta = -999;
    if (e.key === 'End') delta = 999;
    if (!delta) return;
    e.preventDefault();
    if (which === 'lo') onChange(Math.max(min, Math.min(lo + delta, hi)), hi);
    else onChange(lo, Math.min(max, Math.max(hi + delta, lo)));
  };

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="dual-range">
      <div
        className="dual-range-track"
        ref={trackRef}
        onPointerDown={onTrackDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
      >
        <div className="dual-range-fill" style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        <button
          className="dual-range-handle"
          style={{ left: `${pct(lo)}%` }}
          role="slider"
          aria-label={`${ariaLabel} — min`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={lo}
          aria-valuetext={formatValue(lo)}
          onPointerDown={startDrag('lo')}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onKeyDown={key('lo')}
        />
        <button
          className="dual-range-handle"
          style={{ left: `${pct(hi)}%` }}
          role="slider"
          aria-label={`${ariaLabel} — max`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={hi}
          aria-valuetext={formatValue(hi)}
          onPointerDown={startDrag('hi')}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onKeyDown={key('hi')}
        />
      </div>
      <div className="dual-range-labels">
        <span>{formatValue(lo)}</span>
        <span>{formatValue(hi)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────── Country multiselect ───────────────────────────

export function CountryMultiSelect({
  selected,
  onChange,
  placeholder,
  compact,
}: {
  selected: string[];
  onChange: (codes: string[]) => void;
  placeholder: string;
  compact?: boolean;
}) {
  const { lang } = useApp();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(
    () => searchCountries(query, lang).filter((c) => !selected.includes(c.code)).slice(0, 8),
    [query, lang, selected],
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const add = (code: string) => {
    onChange([...selected, code]);
    setQuery('');
  };
  const remove = (code: string) => onChange(selected.filter((c) => c !== code));

  return (
    <div className={`country-select ${compact ? 'compact' : ''}`} ref={wrapRef}>
      <div className="country-select-box" onClick={() => setOpen(true)}>
        {selected.map((code) => (
          <span key={code} className="chip chip-violet chip-removable">
            {countryName(code, lang)}
            <button aria-label={`Remove ${countryName(code, lang)}`} onClick={(e) => { e.stopPropagation(); remove(code); }}>
              <Icon name="x" size={11} strokeWidth={2.2} />
            </button>
          </span>
        ))}
        <input
          value={query}
          placeholder={selected.length === 0 ? placeholder : ''}
          aria-label={placeholder}
          aria-expanded={open}
          aria-controls={listId}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              e.preventDefault();
              add(results[0].code);
            }
            if (e.key === 'Backspace' && !query && selected.length) remove(selected[selected.length - 1]);
            if (e.key === 'Escape') setOpen(false);
          }}
        />
      </div>
      {open && results.length > 0 && (
        <ul className="country-select-list" id={listId} role="listbox">
          {results.map((c) => (
            <li key={c.code}>
              <button role="option" aria-selected="false" onClick={() => add(c.code)}>
                <span>{lang === 'zh' ? c.zh : c.en}</span>
                <span className="country-code">{c.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Single-country picker built on the same affordance. */
export function CountrySingleSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string | undefined;
  onChange: (code: string | undefined) => void;
  placeholder: string;
}) {
  return (
    <CountryMultiSelect
      selected={value ? [value] : []}
      onChange={(codes) => onChange(codes.length ? codes[codes.length - 1] : undefined)}
      placeholder={placeholder}
      compact
    />
  );
}

// ─────────────────────────── Scroll reveal & count-up ───────────────────────────

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'span';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('revealed');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('revealed');
            obs.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(eased * value));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}

// ─────────────────────────── Loanza chart DNA ───────────────────────────

const ACCENTS: Record<string, string> = {
  violet: 'var(--violet)',
  green: 'var(--green)',
  orange: 'var(--orange)',
  gold: 'var(--gold)',
};

/** Deterministic pseudo-random in [0,1) from a seed + index. */
function prand(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 31.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Fine vertical tick-bar chart (the Loanza micro-chart). Mostly rest-grey
 * bars with one accented cluster. Purely decorative — aria-hidden.
 */
export function TickBar({
  n = 48,
  seed = 7,
  accent = 'violet',
  cluster = 0.62,
  height = 32,
  scale,
  marker,
  className,
}: {
  n?: number;
  seed?: number;
  accent?: keyof typeof ACCENTS | 'multi';
  cluster?: number; // 0–1 position of the accent cluster
  height?: number;
  /** tiny axis labels under the chart, e.g. ['0','100'] — Loanza signature */
  scale?: [string, string];
  /** small data-point dot floated above the cluster */
  marker?: keyof typeof ACCENTS;
  className?: string;
}) {
  const pitch = 2.8;
  const bars = useMemo(() => {
    const out: { h: number; c: string }[] = [];
    const multi = ['var(--orange)', 'var(--green)', 'var(--violet)'];
    const clusterIdx = Math.floor(cluster * n);
    for (let i = 0; i < n; i++) {
      const base = 0.22 + prand(seed, i) * 0.72;
      const nearCluster = Math.abs(i - clusterIdx) <= 2;
      const c =
        accent === 'multi'
          ? prand(seed + 3, i) > 0.78
            ? multi[i % 3]
            : 'var(--tick-rest)'
          : nearCluster
            ? ACCENTS[accent]
            : 'var(--tick-rest)';
      out.push({ h: nearCluster ? Math.max(base, 0.72) : base, c });
    }
    return out;
  }, [n, seed, accent, cluster]);

  const clusterIdx = Math.floor(cluster * n);
  const pad = marker ? 7 : 0;

  return (
    <div className={`tickbar ${className ?? ''}`}>
      <svg
        viewBox={`0 0 ${n * pitch} ${height + pad}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: height + pad }}
        aria-hidden="true"
      >
        {bars.map((b, i) => (
          <rect
            key={i}
            x={i * pitch}
            y={pad + (height - b.h * height)}
            width={1.35}
            height={b.h * height}
            rx={0.65}
            fill={b.c}
          />
        ))}
        {marker && (
          <circle
            cx={clusterIdx * pitch + 0.7}
            cy={pad + (height - bars[clusterIdx].h * height) - 4}
            r={2.6}
            fill={ACCENTS[marker]}
          />
        )}
      </svg>
      {scale && (
        <div className="tick-scale" aria-hidden="true">
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Semicircular tick gauge (Loanza "Submissions" style). Ticks fan across
 * 180°; the filled portion takes the accent colour.
 */
export function TickGauge({
  percent,
  size = 170,
  accent = 'orange',
  label,
  value,
}: {
  percent: number;
  size?: number;
  accent?: keyof typeof ACCENTS;
  label?: string;
  value?: string;
}) {
  const ticks = 48;
  const filled = Math.round((Math.min(100, Math.max(0, percent)) / 100) * ticks);
  const cx = 100;
  const cy = 92;
  const r1 = 64;
  const r2 = 88;
  return (
    <div className="tick-gauge" style={{ width: size }}>
      <svg viewBox="0 0 200 100" style={{ width: '100%' }} role="img" aria-label={`${percent}%`}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const a = Math.PI - (i / ticks) * Math.PI;
          const x1 = cx + r1 * Math.cos(a);
          const y1 = cy - r1 * Math.sin(a);
          const x2 = cx + r2 * Math.cos(a);
          const y2 = cy - r2 * Math.sin(a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i <= filled ? ACCENTS[accent] : 'var(--tick-rest)'}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="tick-gauge-ends" aria-hidden="true">
        <span>0</span>
        <span>100</span>
      </div>
      <div className="tick-gauge-text">
        <span className="tick-gauge-value num">{value ?? `${percent}%`}</span>
        {label && <span className="tick-gauge-label">{label}</span>}
      </div>
    </div>
  );
}

/** Tiny ▲/▼ delta chip. */
export function Delta({ value, dir }: { value: string; dir: 'up' | 'down' }) {
  return (
    <span className={`delta delta-${dir}`}>
      <svg width="7" height="6" viewBox="0 0 8 7" aria-hidden="true">
        <path d={dir === 'up' ? 'M4 0 8 7H0z' : 'M4 7 0 0h8z'} fill="currentColor" />
      </svg>
      {value}
    </span>
  );
}

/** Browser-chrome frame for product mockups (the Loanza hero treatment). */
export function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="browser-frame">
      <div className="browser-chrome">
        <span className="browser-dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="browser-url">
          <Icon name="lock" size={10} strokeWidth={2.2} />
          {url}
        </span>
        <span className="browser-chrome-spacer" />
      </div>
      <div className="browser-body">{children}</div>
    </div>
  );
}

// ─────────────────────────── Field helpers ───────────────────────────

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
