import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './state/store';
import { Footer, Navbar, RequireAuth, ScrollToTop, TitleManager, VerifyBanner } from './components/layout';
import { SavePromptProvider } from './components/opportunity';
import { ToastHost } from './components/ui';
import { ErrorBoundary, ErrorPage, NotFoundPage } from './pages/System';
import LandingPage from './pages/Landing';
import DatabasePage from './pages/Database';
import DetailPage from './pages/Detail';
import ResourcesPage, { ResourceArticlePage } from './pages/Resources';
import DashboardPage from './pages/Dashboard';
import OnboardingPage from './pages/Onboarding';
import SettingsPage from './pages/Settings';
import { ForgotPage, ResetPage, SignInPage, SignUpPage } from './pages/Auth';
import { AboutPage, PrivacyPage, SupportPage, TermsPage } from './pages/Static';

function Shell() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/auth');

  return (
    <SavePromptProvider>
      <ScrollToTop />
      <TitleManager />
      {!isAuthRoute && <VerifyBanner />}
      {!isAuthRoute && <Navbar />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/opportunities" element={<DatabasePage />} />
          <Route path="/opportunities/:slug" element={<DetailPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:slug" element={<ResourceArticlePage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/forgot" element={<ForgotPage />} />
          <Route path="/auth/reset" element={<ResetPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
      {!isAuthRoute && <Footer />}
      <ToastHost />
    </SavePromptProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}
