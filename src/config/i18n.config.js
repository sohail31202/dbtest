import path from "path";
import i18n from "i18n";

i18n.configure({
    "locales": ["en"],
    "defaultLocale": "en",
    "queryParameter": "lang",
    "directory": path.join(__dirname, "/../locales"),
    "api": {
        "__": "translate",
        "__n": "translateN"
    }
});

export default i18n;