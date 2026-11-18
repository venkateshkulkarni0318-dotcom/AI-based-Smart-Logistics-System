import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CommandRoleSwitcher from './components/CommandRoleSwitcher';
import WalkthroughModal from './components/WalkthroughModal';
import GlossaryModal from './components/GlossaryModal';
import ExaminerScenarioModal from './components/ExaminerScenarioModal';
import CommandPalette from './components/CommandPalette';
import ErrorBoundary from './components/ErrorBoundary';
import { CommandRoleProvider } from './context/CommandRoleContext';
import { UiPreferencesProvider } from './context/UiPreferencesContext';
import { ToastProvider } from './components/Toast';
import { Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import MultimodalPage from './pages/MultimodalPage';
import MLRiskPage from './pages/MLRiskPage';
import VillagesPage from './pages/VillagesPage';
import RoutesPage from './pages/RoutesPage';
import DisasterPage from './pages/DisasterPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import Dashboard from './pages/Dashboard';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('ai_logix_sidebar_collapsed') === 'true';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ai_logix_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ai_logix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('ai_logix_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <Router>
      <ToastProvider>
        <UiPreferencesProvider>
          <CommandRoleProvider>
            <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
              {/* Interactive Demo Scenario Rehearsal Modal */}
              <WalkthroughModal />
              {/* Technical Glossary & Standards Modal */}
              <GlossaryModal />
              {/* Examiner & Viva Evaluation Challenge Modal */}
              <ExaminerScenarioModal />
              {/* Apple-style Command Palette (Ctrl+K) */}
              <CommandPalette />
          {/* Mobile hamburger button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Sidebar Navigation */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            theme={theme}
            onToggleTheme={toggleTheme}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />

          {/* Main Content Area */}
          <main className="main-content" id="main-content" tabIndex="-1">
            {/* Role-Based Command Perspective Switcher */}
            <CommandRoleSwitcher />

            <div style={{ padding: '0 0.5rem' }}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/multimodal" element={<MultimodalPage />} />
                  <Route path="/ml-risk" element={<MLRiskPage />} />
                  <Route path="/villages" element={<VillagesPage />} />
                  <Route path="/routes" element={<RoutesPage />} />
                  <Route path="/disaster" element={<DisasterPage />} />
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsConditionsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </CommandRoleProvider>
    </UiPreferencesProvider>
    </ToastProvider>
  </Router>
);
}

export default App;

