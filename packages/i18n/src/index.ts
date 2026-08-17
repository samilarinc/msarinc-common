import tr from './locales/tr.json';
import en from './locales/en.json';

export type SupportedLanguage = 'tr' | 'en';

export type CommonResource = typeof tr;

/**
 * i18next çoklu-namespace kullanımı için: tüketen proje kendi i18n.init()
 * çağrısında bunu ikinci bir "common" namespace olarak ekler, örn.
 *
 *   resources: {
 *     tr: { translation: appTr, common: commonResources.tr },
 *     en: { translation: appEn, common: commonResources.en },
 *   }
 *
 * ve `useTranslation('common')` veya `t('theme.light', { ns: 'common' })` ile kullanır.
 */
export const commonResources: Record<SupportedLanguage, CommonResource> = { tr, en };

export const COMMON_NAMESPACE = 'common' as const;
