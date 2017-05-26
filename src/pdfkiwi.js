const request       = require('request');
const isPlainObject = require('lodash.isplainobject');
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
        return new Promise((resolve, reject) => {
            const formData = {
                email   : this.apiEmail,
                token   : this.apiToken,
                html    : params.src,
                options : params.options || {}
            };

            const requestOptions = { baseUrl: this.api, form: formData, encoding: null };
            request.post(endpoint, requestOptions, (err, res, body) => {
                if (err) {
                    reject(new PdfkiwiError(err.message));
                    return;
                }

                if (res.statusCode < 200 || res.statusCode >= 300) {
                    let errData;
                    try {
                        errData = JSON.parse(body.toString('utf8')).error || {};
                        if ((errData.code || errData.code === 0) && !errData.message) {
                            errData.message = `API error occurred, see the code.`;
                        }
                    } catch (_) {
                        // eslint-disable-next no-empty
                    }

                    errData = Object.assign({ code: null, message: `Unknown API error: ${body}` }, errData);
                    reject(new PdfkiwiError(errData.message, errData.code, res.statusCode));
                    return;
                }

                resolve(body);
            });
        });
    }
}

module.exports = Pdfkiwi;
