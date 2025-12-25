import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// --- Namespaces que existen en cada idioma ---
const namespaces = [
  "common",
  "home",
  "info",
  "lines",
  "linesDetails",
  "map",
  "stationDetail",
  "status",
] as const;

export const defaultNS = "common";

// =====================
// EN
// =====================
import en_common from "./locales/en/common.json";
import en_home from "./locales/en/home.json";
import en_info from "./locales/en/info.json";
import en_lines from "./locales/en/lines.json";
import en_linesDetails from "./locales/en/linesDetails.json";
import en_map from "./locales/en/map.json";
import en_stationDetail from "./locales/en/stationDetail.json";
import en_status from "./locales/en/status.json";

// =====================
// ES
// =====================
import es_common from "./locales/es/common.json";
import es_home from "./locales/es/home.json";
import es_info from "./locales/es/info.json";
import es_lines from "./locales/es/lines.json";
import es_linesDetails from "./locales/es/linesDetails.json";
import es_map from "./locales/es/map.json";
import es_stationDetail from "./locales/es/stationDetail.json";
import es_status from "./locales/es/status.json";

// =====================
// GL
// =====================
import gl_common from "./locales/gl/common.json";
import gl_home from "./locales/gl/home.json";
import gl_info from "./locales/gl/info.json";
import gl_lines from "./locales/gl/lines.json";
import gl_linesDetails from "./locales/gl/linesDetails.json";
import gl_map from "./locales/gl/map.json";
import gl_stationDetail from "./locales/gl/stationDetail.json";
import gl_status from "./locales/gl/status.json";

// =====================
// EU
// =====================
import eu_common from "./locales/eu/common.json";
import eu_home from "./locales/eu/home.json";
import eu_info from "./locales/eu/info.json";
import eu_lines from "./locales/eu/lines.json";
import eu_linesDetails from "./locales/eu/linesDetails.json";
import eu_map from "./locales/eu/map.json";
import eu_stationDetail from "./locales/eu/stationDetail.json";
import eu_status from "./locales/eu/status.json";

// =====================
// CA
// =====================
import ca_common from "./locales/ca/common.json";
import ca_home from "./locales/ca/home.json";
import ca_info from "./locales/ca/info.json";
import ca_lines from "./locales/ca/lines.json";
import ca_linesDetails from "./locales/ca/linesDetails.json";
import ca_map from "./locales/ca/map.json";
import ca_stationDetail from "./locales/ca/stationDetail.json";
import ca_status from "./locales/ca/status.json";

// =====================
// PT
// =====================
import pt_common from "./locales/pt/common.json";
import pt_home from "./locales/pt/home.json";
import pt_info from "./locales/pt/info.json";
import pt_lines from "./locales/pt/lines.json";
import pt_linesDetails from "./locales/pt/linesDetails.json";
import pt_map from "./locales/pt/map.json";
import pt_stationDetail from "./locales/pt/stationDetail.json";
import pt_status from "./locales/pt/status.json";

export const resources = {
  en: {
    common: en_common,
    home: en_home,
    info: en_info,
    lines: en_lines,
    linesDetails: en_linesDetails,
    map: en_map,
    stationDetail: en_stationDetail,
    status: en_status,
  },
  es: {
    common: es_common,
    home: es_home,
    info: es_info,
    lines: es_lines,
    linesDetails: es_linesDetails,
    map: es_map,
    stationDetail: es_stationDetail,
    status: es_status,
  },
  gl: {
    common: gl_common,
    home: gl_home,
    info: gl_info,
    lines: gl_lines,
    linesDetails: gl_linesDetails,
    map: gl_map,
    stationDetail: gl_stationDetail,
    status: gl_status,
  },
  eu: {
    common: eu_common,
    home: eu_home,
    info: eu_info,
    lines: eu_lines,
    linesDetails: eu_linesDetails,
    map: eu_map,
    stationDetail: eu_stationDetail,
    status: eu_status,
  },
  ca: {
    common: ca_common,
    home: ca_home,
    info: ca_info,
    lines: ca_lines,
    linesDetails: ca_linesDetails,
    map: ca_map,
    stationDetail: ca_stationDetail,
    status: ca_status,
  },
  pt: {
    common: pt_common,
    home: pt_home,
    info: pt_info,
    lines: pt_lines,
    linesDetails: pt_linesDetails,
    map: pt_map,
    stationDetail: pt_stationDetail,
    status: pt_status,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["pt", "es", "gl", "eu", "ca", "en"],
    ns: namespaces as unknown as string[],
    defaultNS,
    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "metroVigoLang",
    },
  });

export default i18n;
