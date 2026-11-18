import React, { createContext, useContext, useState, useEffect } from 'react';

// Multi-language dictionary for English, Hindi, and Kannada
const TRANSLATIONS = {
  en: {
    appTitle: 'AI-LOGIX COMMAND PLATFORM',
    tagline: 'Multi-Modal Rural Logistics & Disaster Management',
    simpleMode: 'Simple View (Officer)',
    techMode: 'Technical View (Engineering)',
    walkthroughBtn: 'Scenario Walkthrough (Zanskar Cutoff)',
    home: 'Command Overview',
    multimodal: 'Transport Models',
    mlRisk: 'Risk Predictor',
    villages: 'Settlements',
    routes: 'Route Intelligence',
    disaster: 'Disaster Command',
    caseStudies: 'Case Studies',
    offlineStatus: '100% Offline Active',
    topActions: "Today's Top 3 Tactical Directives",
    measuredLatency: 'Measured Latency',
    criticalCutoff: 'Critical Cutoff',
    normalRoads: 'Normal Road Convoys Operational',
    droneActive: 'Autonomous UAV Lifeline Deployed',
    disasterActive: 'Crisis Mode Active',
    emergencyBriefing: 'Executive Situation Briefing',
    simulatedBadge: 'Simulated Demo Data',
    verifiedBadge: 'Verified Telemetry',
    disasterModeLabel: 'Disaster Management Mode',
    crisisActiveLabel: 'Crisis Response Active',
    liteModeLabel: 'Lite Bandwidth Mode',
    toolsMenu: 'Tools & Utilities',
    commandPaletteTitle: 'Quick Action Command Palette',
    closeDrawer: 'Close Details Drawer'
  },
  hi: {
    appTitle: 'एआई-लॉजिक्स कमांड प्लेटफॉर्म',
    tagline: 'मल्टी-मॉडल ग्रामीण रसद एवं आपदा प्रबंधन',
    simpleMode: 'सरल दृश्य (अधिकारी)',
    techMode: 'तकनीकी दृश्य (इंजीनियरिंग)',
    walkthroughBtn: 'परिदृश्य डेमो (ज़ांस्कर हिमस्खलन)',
    home: 'कमांड अवलोकन',
    multimodal: 'परिवहन मॉडल',
    mlRisk: 'जोखिम पूर्वानुमान',
    villages: 'बस्तियां एवं चौकियां',
    routes: 'मार्ग अनुकूलन',
    disaster: 'आपदा प्रबंधन केंद्र',
    caseStudies: 'केस स्टडीज',
    offlineStatus: '100% ऑफलाइन सक्रिय',
    topActions: 'आज के शीर्ष 3 सामरिक निर्देश',
    measuredLatency: 'मापी गई विलंबता',
    criticalCutoff: 'गंभीर मार्ग अवरोध',
    normalRoads: 'सामान्य सड़क काफिला चालू',
    droneActive: 'स्वायत्त ड्रोन जीवनरेखा तैनात',
    disasterActive: 'संकट काल सक्रिय',
    emergencyBriefing: 'कार्यकारी स्थिति रिपोर्ट',
    simulatedBadge: 'सिम्युलेटेड डेमो डेटा',
    verifiedBadge: 'सत्यापित टेलीमेट्री',
    disasterModeLabel: 'आपदा प्रबंधन मोड',
    crisisActiveLabel: 'संकट काल सक्रिय',
    liteModeLabel: 'कम बैंडविड्थ लाइट मोड',
    toolsMenu: 'उपकरण एवं सेटिंग्स',
    commandPaletteTitle: 'त्वरित कमांड पैलेट',
    closeDrawer: 'विवरण बंद करें'
  },
  kn: {
    appTitle: 'ಎಐ-ಲಾಜಿಕ್ಸ್ ಕಮಾಂಡ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
    tagline: 'ಬಹು-ಮಾದರಿ ಗ್ರಾಮೀಣ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮತ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣೆ',
    simpleMode: 'ಸರಳ ನೋಟ (ಅಧಿಕಾರಿ)',
    techMode: 'ತಾಂತ್ರಿಕ ನೋಟ (ಇಂಜಿನಿಯರಿಂಗ್)',
    walkthroughBtn: 'ಡೆಮೊ ನಡಿಗೆ (ಜಾನ್ಸ್ಕರ್ ಪಾಸ್ ಕಟ್‌ಆಫ್)',
    home: 'ಕಮಾಂಡ್ ಅವಲೋಕನ',
    multimodal: 'ಸಾರಿಗೆ ಮಾದರಿಗಳು',
    mlRisk: 'ಅಪಾಯ ಮುನ್ಸೂಚನೆ',
    villages: 'ಗ್ರಾಮಗಳು ಮತ್ತು ಹೊರಠಾಣೆಗಳು',
    routes: 'ಮಾರ್ಗ ಆಪ್ಟಿಮೈಸೇಶನ್',
    disaster: 'ವಿಪತ್ತು ಕಮಾಂಡ್',
    caseStudies: 'ಪ್ರಕರಣ ಅಧ್ಯಯನಗಳು',
    offlineStatus: '100% ಆಫ್‌ಲೈನ್ ಸಕ್ರಿಯ',
    topActions: 'ಇಂದಿನ ಪ್ರಮುಖ 3 ನಿರ್ದೇಶನಗಳು',
    measuredLatency: 'ಅಳತೆ ಮಾಡಿದ ವಿಳಂಬ',
    criticalCutoff: 'ತೀವ್ರ ಮಾರ್ಗ ನಿರ್ಬಂಧ',
    normalRoads: 'ಸಾಮಾನ್ಯ ರಸ್ತೆ ಸಂಚಾರ ಲಭ್ಯ',
    droneActive: 'ಸ್ವಾಯತ್ತ ಡ್ರೋನ್ ಲೈಫ್‌ಲೈನ್ ನಿಯೋಜಿಸಲಾಗಿದೆ',
    disasterActive: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಸಕ್ರಿಯ',
    emergencyBriefing: 'ಕಾರ್ಯನಿರ್ವಾಹಕ ಪರಿಸ್ಥಿತಿ ವರದಿ',
    simulatedBadge: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೆಮೊ ಡೇಟಾ',
    verifiedBadge: 'ಪರಿಶೀಲಿಸಿದ ಟೆಲಿಮೆಟ್ರಿ',
    disasterModeLabel: 'ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಮೋಡ್',
    crisisActiveLabel: 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಸಕ್ರಿಯ',
    liteModeLabel: 'ಕಡಿಮೆ ಬ್ಯಾಂಡ್‌ವಿಡ್ತ್ ಲೈಟ್ ಮೋಡ್',
    toolsMenu: 'ಪರಿಕರಗಳು ಮತ್ತು ಆಯ್ಕೆಗಳು',
    commandPaletteTitle: 'ತ್ವರಿತ ಕಮಾಂಡ್ ಪ್ಯಾಲೆಟ್',
    closeDrawer: 'ವಿವರಗಳನ್ನು ಮುಚ್ಚಿ'
  }
};

const UiPreferencesContext = createContext(null);

export const UiPreferencesProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('ai_logix_view_mode') || 'simple';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('ai_logix_lang') || 'en';
  });

  const [isDisasterMode, setIsDisasterMode] = useState(() => {
    return localStorage.getItem('ai_logix_disaster_mode') === 'true';
  });

  const [liteMode, setLiteMode] = useState(() => {
    return localStorage.getItem('ai_logix_lite_mode') === 'true';
  });

  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [examinerOpen, setExaminerOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    return localStorage.getItem('ai_logix_sound_enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('ai_logix_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('ai_logix_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ai_logix_disaster_mode', String(isDisasterMode));
    if (isDisasterMode) {
      document.documentElement.setAttribute('data-emergency', 'true');
    } else {
      document.documentElement.removeAttribute('data-emergency');
    }
  }, [isDisasterMode]);

  useEffect(() => {
    localStorage.setItem('ai_logix_lite_mode', String(liteMode));
    if (liteMode) {
      document.documentElement.setAttribute('data-litemode', 'true');
    } else {
      document.documentElement.removeAttribute('data-litemode');
    }
  }, [liteMode]);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);

  const toggleSound = () => {
    setSoundEnabledState(prev => {
      const next = !prev;
      localStorage.setItem('ai_logix_sound_enabled', next ? 'true' : 'false');
      return next;
    });
  };

  const toggleDisasterMode = () => {
    setIsDisasterMode(prev => !prev);
  };

  const toggleLiteMode = () => {
    setLiteMode(prev => !prev);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'simple' ? 'technical' : 'simple'));
  };

  const isSimpleMode = viewMode === 'simple';

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <UiPreferencesContext.Provider
      value={{
        viewMode,
        isSimpleMode,
        toggleViewMode,
        setViewMode,
        language,
        setLanguage,
        isDisasterMode,
        setIsDisasterMode,
        toggleDisasterMode,
        liteMode,
        setLiteMode,
        toggleLiteMode,
        t,
        walkthroughOpen,
        setWalkthroughOpen,
        glossaryOpen,
        setGlossaryOpen,
        examinerOpen,
        setExaminerOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        soundEnabled,
        toggleSound
      }}
    >
      {children}
    </UiPreferencesContext.Provider>
  );
};

export const useUiPreferences = () => {
  const ctx = useContext(UiPreferencesContext);
  if (!ctx) {
    throw new Error('useUiPreferences must be used within a UiPreferencesProvider');
  }
  return ctx;
};

export default UiPreferencesContext;
