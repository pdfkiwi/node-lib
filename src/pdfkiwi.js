const request       = require('request');
const isPlainObject = require('lodash.isplainobject');
const defer         = require('promise-defer');
const PdfkiwiError  = require('./pdfkiwi-error');
const Queue         = require('./utils/queue');

class Pdfkiwi {
    constructor(apiEmail, apiToken) {
        if (!apiEmail || !apiToken) {
            throw new Error(`[Pdfkiwi] Incomplete Pdf.kiwi API credentials.`);
        }

        this.api      = 'https://pdf.kiwi/api';
        this.apiEmail = apiEmail;
        this.apiToken = apiToken;
    }

    convertHtml(html, options) {
        if (!html && html !== 0) {
            throw new Error(`[Pdfkiwi#convertHtml] No HTML provided.`);
        }

        if (typeof html !== 'string' && (typeof html !== 'number' || !Number.isFinite(html))) {
            throw new TypeError(`[Pdfkiwi#convertHtml] Invalid HTML string.`);
        }

        const params = { src: html.toString() };
        if (options) {
            if (!isPlainObject(options)) {
                throw new TypeError(`[Pdfkiwi#convertHtml] Invalid options object.`);
            }
            params.options = Object.assign({}, options);
        }

        return Queue.add(() => this._doRequest('/generator/render/', params));
    }

    _doRequest(endpoint, params) {
        const deferred = defer();
        const formData = {
            email   : this.apiEmail,
            token   : this.apiToken,
            html    : params.src,
            options : params.options || {}
        };

        const requestOptions = { baseUrl: this.api, form: formData };
        request.post(endpoint, requestOptions, (err, res, body) => {
            if (err) {
                deferred.reject(new PdfkiwiError(err.message, -1));
                return;
            }

            if (res.statusCode < 200 || res.statusCode >= 300) {
                const errData = { message: `Unknown API error: ${body}`, code: -1 };
                try {
                    Object.assign(errData, JSON.parse(body).error || {});
                } catch (_) {
                    // eslint-disable-next no-empty
                }

                deferred.reject(new PdfkiwiError(errData.message, errData.code, res.statusCode));
                return;
            }

            deferred.resolve(body);
        });

        return deferred.promise;
    }
}

module.exports = Pdfkiwi;
