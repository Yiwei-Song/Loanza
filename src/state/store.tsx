import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Bi, Lang, UserAccount, UserProfile } from '../types';
import { translate } from '../i18n/translations';
import { tVocab } from '../data/vocab';

// ─────────────────────────── persistence ───────────────────────────

const STORAGE_KEY = 'circle-breaker:v1';

interface PersistedState {
  lang: Lang;
  users: UserAccount[];
  currentUserId: string | null;
  lens: string[];
}

const DEMO_USER: UserAccount = {
  id: 'demo',
  name: 'Amara Diallo',
  email: 'demo@circlebreaker.club',
  password: 'breakout',
  verified: true,
  member: true,
  profile: {
    gender: 'female',
    nationality: 'SN',
    residency: 'SN',
    education: 'Bachelor',
    experienceYears: 2,
    interestTypes: ['Fellowship', "Master's Scholarship", 'Forum / Summit'],
    interestSectors: ['Social Impact & Development', 'Technology & Computing'],
  },
  saved: ['oyw-2026', 'undp-grad-2026', 'chevening-2027', 'mastercard-toronto-2027', 'unv-online'],
  createdAt: '2026-03-02',
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (!parsed.users.some((u) => u.id === 'demo')) parsed.users.unshift(DEMO_USER);
      return parsed;
    }
  } catch {
    /* corrupted storage — start fresh */
  }
  return { lang: 'en', users: [DEMO_USER], currentUserId: null, lens: [] };
}

// ─────────────────────────── toasts ───────────────────────────

export interface Toast {
  id: number;
  message: string;
  tone: 'default' | 'success' | 'error';
}

// ─────────────────────────── context shape ───────────────────────────

interface AppStore {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tb: (bi: Bi) => string;
  tv: (vocabTerm: string) => string;

  user: UserAccount | null;
  signIn: (email: string, password: string) => 'ok' | 'wrong';
  signUp: (name: string, email: string, password: string) => 'ok' | 'exists';
  signOut: () => void;
  signInDemo: () => void;
  resetPassword: (email: string, newPassword: string) => 'ok' | 'missing';
  emailExists: (email: string) => boolean;
  markVerified: () => void;
  setMember: (member: boolean) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateAccount: (patch: { name?: string; email?: string; password?: string }) => void;
  deleteAccount: () => void;

  saved: Set<string>;
  toggleSave: (oppId: string) => boolean; // returns new saved state
  isSaved: (oppId: string) => boolean;

  lens: string[];
  setLens: (codes: string[]) => void;

  toasts: Toast[];
  toast: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<AppStore | null>(null);

let toastId = 0;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — in-memory still works */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  }, [state.lang]);

  const user = state.users.find((u) => u.id === state.currentUserId) ?? null;

  const setLang = useCallback((l: Lang) => setState((s) => ({ ...s, lang: l })), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(key, state.lang, vars),
    [state.lang],
  );
  const tb = useCallback((bi: Bi) => bi[state.lang], [state.lang]);
  const tv = useCallback((term: string) => tVocab(term, state.lang), [state.lang]);

  const toast = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    const id = ++toastId;
    setToasts((ts) => [...ts.slice(-2), { id, message, tone }]);
    const timer = window.setTimeout(() => {
      setToasts((ts) => ts.filter((x) => x.id !== id));
      timers.current.delete(id);
    }, 3600);
    timers.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((ts) => ts.filter((x) => x.id !== id));
  }, []);

  const mutateUser = useCallback((fn: (u: UserAccount) => UserAccount) => {
    setState((s) => {
      if (!s.currentUserId) return s;
      return { ...s, users: s.users.map((u) => (u.id === s.currentUserId ? fn(u) : u)) };
    });
  }, []);

  const signIn = useCallback(
    (email: string, password: string): 'ok' | 'wrong' => {
      const found = state.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
      );
      if (!found) return 'wrong';
      setState((s) => ({ ...s, currentUserId: found.id }));
      return 'ok';
    },
    [state.users],
  );

  const signUp = useCallback(
    (name: string, email: string, password: string): 'ok' | 'exists' => {
      const exists = state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) return 'exists';
      const account: UserAccount = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        password,
        verified: false,
        member: false,
        profile: { interestTypes: [], interestSectors: [] },
        saved: [],
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setState((s) => ({ ...s, users: [...s.users, account], currentUserId: account.id }));
      return 'ok';
    },
    [state.users],
  );

  const signOut = useCallback(() => setState((s) => ({ ...s, currentUserId: null })), []);

  const signInDemo = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: 'demo' }));
  }, []);

  const emailExists = useCallback(
    (email: string) => state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()),
    [state.users],
  );

  const resetPassword = useCallback(
    (email: string, newPassword: string): 'ok' | 'missing' => {
      const found = state.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) return 'missing';
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === found.id ? { ...u, password: newPassword } : u)),
      }));
      return 'ok';
    },
    [state.users],
  );

  const markVerified = useCallback(() => mutateUser((u) => ({ ...u, verified: true })), [mutateUser]);
  const setMember = useCallback((member: boolean) => mutateUser((u) => ({ ...u, member })), [mutateUser]);

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => mutateUser((u) => ({ ...u, profile: { ...u.profile, ...patch } })),
    [mutateUser],
  );

  const updateAccount = useCallback(
    (patch: { name?: string; email?: string; password?: string }) =>
      mutateUser((u) => ({
        ...u,
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.email !== undefined && patch.email !== u.email
          ? { email: patch.email, verified: false }
          : {}),
        ...(patch.password !== undefined ? { password: patch.password } : {}),
      })),
    [mutateUser],
  );

  const deleteAccount = useCallback(() => {
    setState((s) => ({
      ...s,
      users: s.users.filter((u) => u.id !== s.currentUserId || u.id === 'demo'),
      currentUserId: null,
    }));
  }, []);

  const saved = useMemo(() => new Set(user?.saved ?? []), [user]);

  const toggleSave = useCallback(
    (oppId: string): boolean => {
      let nowSaved = false;
      mutateUser((u) => {
        if (u.saved.includes(oppId)) {
          nowSaved = false;
          return { ...u, saved: u.saved.filter((x) => x !== oppId) };
        }
        nowSaved = true;
        return { ...u, saved: [...u.saved, oppId] };
      });
      return nowSaved;
    },
    [mutateUser],
  );

  const isSaved = useCallback((oppId: string) => saved.has(oppId), [saved]);

  const setLens = useCallback((codes: string[]) => setState((s) => ({ ...s, lens: codes })), []);

  const value: AppStore = {
    lang: state.lang,
    setLang,
    t,
    tb,
    tv,
    user,
    signIn,
    signUp,
    signOut,
    signInDemo,
    resetPassword,
    emailExists,
    markVerified,
    setMember,
    updateProfile,
    updateAccount,
    deleteAccount,
    saved,
    toggleSave,
    isSaved,
    lens: state.lens,
    setLens,
    toasts,
    toast,
    dismissToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
