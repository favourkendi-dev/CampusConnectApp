import { LANGUAGES } from './constants';

const translations = {
  en: {
    appName: 'Campus Connect',
    tagline: 'Connect with your campus community',
    welcome: 'Welcome back!',
    goodbye: 'See you soon!',
    error: 'Something went wrong',
    success: 'Success!',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    noResults: 'No results found',
    loadMore: 'Load more',
    backToTop: 'Back to top',
    online: 'Online',
    offline: 'Offline',
    typing: 'typing...',
    andMore: 'and {count} more',
  },
};

export const getTranslation = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const formatPlural = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};