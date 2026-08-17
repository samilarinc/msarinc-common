import tr from './locales/tr.json';
import en from './locales/en.json';

export type SupportedLanguage = 'tr' | 'en';

export type CommonResource = typeof tr;

/** i18next'te ikinci bir "common" namespace olarak eklenir, bkz. README. */
export const commonResources: Record<SupportedLanguage, CommonResource> = { tr, en };

export const COMMON_NAMESPACE = 'common' as const;
