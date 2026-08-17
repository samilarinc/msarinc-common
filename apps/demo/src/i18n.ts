import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { commonResources } from '@msarinc/i18n-common';

const demoTr = {
  title: 'msarinc-common — native demo',
  subtitle: 'Ortak tema ve i18n paketlerinin native önizlemesi.',
  role: 'Geliştirici',
  aboutTitle: 'Proje Hakkında',
  aboutText: 'Bu, msarinc-common paketlerinin Expo üzerinde nasıl çalıştığını gösteren bir demo ekranıdır.',
  updatesTitle: 'Güncelleme Notları',
};

const demoEn = {
  title: 'msarinc-common — native demo',
  subtitle: 'Native preview of the shared theme and i18n packages.',
  role: 'Developer',
  aboutTitle: 'About the Project',
  aboutText: 'This is a demo screen showing how msarinc-common packages run on Expo.',
  updatesTitle: 'Release Notes',
};

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: demoTr, common: commonResources.tr },
    en: { translation: demoEn, common: commonResources.en },
  },
  lng: 'tr',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
