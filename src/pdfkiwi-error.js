class PdfkiwiError extends Error {
    constructor(message, code, status) {
        super(message);

        const hasValidCode = code !== null && code !== undefined;
        Object.defineProperty(this, 'message', {
            configurable : true,
            enumerable   : false,
            value        : hasValidCode ? `${code}: ${message}` : message,
            writable     : true
        });

        Object.defineProperty(this, 'name', {
            configurable : true,
            enumerable   : false,
            value        : this.constructor.name,
            writable     : true
        });

        Object.defineProperty(this, 'code', {
            configurable : true,
            enumerable   : false,
            value        : code,
            writable     : true
        });

        Object.defineProperty(this, 'status', {
            configurable : true,
            enumerable   : false,
            value        : status,
            writable     : true
        });

        // eslint-disable-next-line no-prototype-builtins
        if (Error.hasOwnProperty('captureStackTrace')) {
            Error.captureStackTrace(this, this.constructor);
            return;
        }

        Object.defineProperty(this, 'stack', {
            configurable : true,
            enumerable   : false,
            value        : (new Error(message)).stack,
            writable     : true
        });
    }
}

module.exports = PdfkiwiError;
