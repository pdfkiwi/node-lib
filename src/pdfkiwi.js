const isPlainObject = require('lodash.isplainobject');

class Pdfkiwi {
    constructor(apiEmail, apiToken) {
        if (!apiEmail || !apiToken) {
            throw new Error(`[Pdfkiwi] Incomplete Pdf.kiwi API credentials.`);
        }
        this.apiEmail = apiEmail;
        this.apiToken = apiToken;
    }

    convertHtml(html, options) {
        if (!html && html !== 0) {
            throw new Error(`[Pdfkiwi#convertHtml] No HTML provided.`);
        }

        const params = { src: html };
        if (options) {
            if (!isPlainObject(options)) {
                throw new TypeError(`[Pdfkiwi#convertHtml] Invalid options object.`);
            }
            params.options = options;
        }
    }
}

module.exports = Pdfkiwi;
