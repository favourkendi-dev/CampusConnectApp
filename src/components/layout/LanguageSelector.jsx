import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, changeLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी',
    pt: 'Português',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{languageNames[language] || language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                changeLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                language === lang ? 'text-primary-600 font-medium' : 'text-gray-700'
              }`}
            >
              {languageNames[lang] || lang}
              {language === lang && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;