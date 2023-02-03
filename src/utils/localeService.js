/**
 * LocaleService
 */
export class LocaleService {
    /**
     * Getting all request.
     *
     * @param  {object}   i18nProvider The i18n provider.
     */
    constructor( i18nProvider ) {
        this.i18nProvider = i18nProvider;
    }

    /**
     *
     * @returns {string} The current locale code.
     */
    getCurrentLocale() {
        return this.i18nProvider.getLocale();
    }

    /**
     *
     * @returns String[] The list of available locale codes.
     */
    getLocales() {
        return this.i18nProvider.getLocales();
    }

    /**
     * Set Locale.
     *
     * @param {String} locale The locale to set. Must be from the list of available locales.
     */
    setLocale( locale ) {
        if ( this.getLocales().indexOf( locale ) !== -1 ) {
            this.i18nProvider.setLocale( locale );
        }
    }

    /**
     *  Translate String.
     *
     * @param {String} string String to translate.
     * @returns {string} Translated string.
     */
    translate( string ) {
        return this.i18nProvider.__( string );
    }
}
