import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es', label: 'ES', flag: '🇧🇴' },
    { code: 'en', label: 'EN', flag: '🇺🇸' }
  ];

  // resolvedLanguage is always one of the supported codes (i18n.language may be 'en-US')
  const activeCode = i18n.resolvedLanguage || i18n.language;
  const currentLanguage = languages.find(lang => lang.code === activeCode) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.label}</span>
        <svg 
          className={`language-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path 
            d="M1 1.5L6 6.5L11 1.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="language-overlay" 
            onClick={() => setIsOpen(false)}
          />
          <div className="language-dropdown">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${
                  language.code === activeCode ? 'active' : ''
                }`}
                onClick={() => changeLanguage(language.code)}
              >
                <span className="language-flag">{language.flag}</span>
                <span className="language-code">{language.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;