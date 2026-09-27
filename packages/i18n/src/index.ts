import tr from './locales/tr.json';
import en from './locales/en.json';

export type SupportedLanguage = 'tr' | 'en';

export type CommonResource = typeof tr;

/** Register as a second "common" namespace in your i18next setup (see README). */
export const commonResources: Record<SupportedLanguage, CommonResource> = { tr, en };

export const COMMON_NAMESPACE = 'common' as const;
