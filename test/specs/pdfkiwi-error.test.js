const expect       = require('chai').expect;
const PdfkiwiError = require('../../src/pdfkiwi-error');

describe(`PdfkiwiError`, () => {
    it(`should be an instance of Error`, () => {
        expect((new PdfkiwiError())).to.be.an.instanceof(Error);
    });

    it(`should return the correct name`, () => {
        expect((new PdfkiwiError()).name).to.equal('PdfkiwiError');
    });

    it(`should accept and return error code`, () => {
        const err = new PdfkiwiError('error', 10);
        expect(err).to.have.property('code');
        expect(err.code).to.equal(10);
    });

    it(`should accept and return error code`, () => {
        const err = new PdfkiwiError('error', 10, 500);
        expect(err).to.have.property('status');
        expect(err.status).to.equal(500);
    });

    it(`should format error message correctly`, () => {
        const err1 = new PdfkiwiError();
        expect(err1.message).to.be.undefined;

        const err2 = new PdfkiwiError('{error message}');
        expect(err2.message).to.equal('{error message}');

        const err3 = new PdfkiwiError('{error message}', 5, 404);
        expect(err3.message).to.equal('5: {error message}');
    });
});
