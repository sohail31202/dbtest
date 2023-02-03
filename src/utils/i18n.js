import i18next from "i18next";
const i18n = i18next.init({
    "backend": {
        "loadPath": `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        "addPath": `${__dirname}/locales/{{lng}}/{{ns}}.missing.json`
    },
    "fallbackLng": "el",
    "preload": ["el", "en"],
    "saveMissing": true
});

export default i18n;