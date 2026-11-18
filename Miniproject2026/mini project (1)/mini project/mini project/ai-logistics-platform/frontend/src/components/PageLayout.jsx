import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Truck,
  Brain,
  Building2,
  Compass,
  AlertTriangle,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Home,
  Check
} from 'lucide-react';

export const OBJECTIVES = [
  { num: '01', id: 'multimodal', title: 'Multi-Modal Transport Model', shortTitle: '01 Transport', path: '/multimodal', Icon: Truck },
  { num: '02', id: 'ml-risk', title: 'ML Disruption Risk Predictor', shortTitle: '02 ML Risk', path: '/ml-risk', Icon: Brain },
  { num: '03', id: 'villages', title: 'Settlement Accessibility Database', shortTitle: '03 Settlements', path: '/villages', Icon: Building2 },
  { num: '04', id: 'routes', title: 'Route Intelligence & Optimization', shortTitle: '04 Routing', path: '/routes', Icon: Compass },
  { num: '05', id: 'disaster', title: 'Disaster Management Center', shortTitle: '05 Disaster & SOS', path: '/disaster', Icon: AlertTriangle },
  { num: '06', id: 'case-studies', title: 'Case-Study Corridors', shortTitle: '06 Case Studies', path: '/case-studies', Icon: Mountain },
];

const PageLayout = ({ title, subtitle, badge, children, actions }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = OBJECTIVES.findIndex(obj => obj.path === location.pathname);
  const isObjectivePage = currentIndex !== -1;
  const currentObj = isObjectivePage ? OBJECTIVES[currentIndex] : null;
  const prevObj = currentIndex > 0 ? OBJECTIVES[currentIndex - 1] : null;
  const nextObj = currentIndex >= 0 && currentIndex < OBJECTIVES.length - 1 ? OBJECTIVES[currentIndex + 1] : null;

  return (
    <>
      {/* Page Header */}
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2>{title}</h2>
              {badge && (
                <span className="badge badge-info">{badge}</span>
              )}
            </div>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {actions}
            </div>
          )}
        </div>

        {/* Top Objective Step Progress Tracker */}
        {isObjectivePage && (
          <nav className="objective-stepper-container" aria-label="Objective Sequence Progress">
            <div className="stepper-scroll">
              {OBJECTIVES.map((obj, idx) => {
                const isActive = idx === currentIndex;
                const isPast = idx < currentIndex;
                const IconComponent = obj.Icon;
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => navigate(obj.path)}
                    className={`stepper-pill ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                    title={`Go to Objective ${obj.num}: ${obj.title}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <span className="stepper-dot">
                      {isPast ? <Check size={10} /> : obj.num}
                    </span>
                    <IconComponent size={14} aria-hidden="true" />
                    <span>{obj.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Page Body */}
      <div className="page-body">
        {children}

        {/* Sequential Navigation Footer for Objectives */}
        {isObjectivePage && (
          <nav className="objective-nav-footer" aria-label="Sequential Objective Navigation">
            <button
              type="button"
              className="nav-btn prev-btn"
              onClick={() => navigate(prevObj ? prevObj.path : '/')}
              aria-label={prevObj ? `Go to previous objective: ${prevObj.title}` : 'Return to Command Overview'}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              <div>
                <span className="nav-direction">Previous</span>
                <span className="nav-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {prevObj ? `${prevObj.num}. ${prevObj.shortTitle}` : <><Home size={12} /> Overview</>}
                </span>
              </div>
            </button>

            <div className="nav-middle-info">
              <span className="progress-badge">
                Objective {currentObj.num} of 06
              </span>
              <div className="nav-dots" role="tablist" aria-label="Objective milestones">
                {OBJECTIVES.map((o, i) => (
                  <span
                    key={o.id}
                    className={`nav-dot ${i === currentIndex ? 'active' : i < currentIndex ? 'completed' : ''}`}
                    onClick={() => navigate(o.path)}
                    title={`Jump to Objective ${o.num}: ${o.shortTitle}`}
                    role="tab"
                    aria-selected={i === currentIndex}
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(o.path);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="nav-btn next-btn"
              onClick={() => navigate(nextObj ? nextObj.path : '/')}
              aria-label={nextObj ? `Proceed to next objective: ${nextObj.title}` : 'Return to Command Overview'}
            >
              <div style={{ textAlign: 'right' }}>
                <span className="nav-direction">{nextObj ? 'Next' : 'Completed'}</span>
                <span className="nav-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  {nextObj ? `${nextObj.num}. ${nextObj.shortTitle}` : <><Home size={12} /> Overview</>}
                </span>
              </div>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </>
  );
};

export default PageLayout;
