/**
 * LEO Senior Standard Reactor - i18n Engine
 * @author Nguyễn Minh Tâm (AKA LEO)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from '../locales/vi.json';
import en from '../locales/en.json';

const resources = {
    vi: { translation: vi },
    en: { translation: en },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi', // Mặc định dùng tiếng Việt
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
