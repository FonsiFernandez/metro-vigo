import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import gl from "./locales/gl/common.json";
import pt from "./locales/pt/common.json";
import eu from "./locales/eu/common.json";
import ca from "./locales/ca/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      es: { common: es },
      gl: { common: gl },
      pt: { common: pt },
      eu: { common: eu },
      ca: { common: ca },
    },
    fallbackLng: "en",
    supportedLngs: ["pt", "es", "gl", "eu", "ca", "en"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "metroVigoLang",
    },
  });

export default i18n;
