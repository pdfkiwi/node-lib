const expect  = require('chai').expect;
const Pdfkiwi = require('../../src/pdfkiwi');

describe('Pdfkiwi', () => {
    describe('constructor', () => {
        it('should throw an error when called with missing API credentials', () => {
            const errorMessage = /Incomplete Pdf\.kiwi API credentials\./;
            const _wrapCall    = (...args) => (
                () => { new Pdfkiwi(...args); } // eslint-disable-line no-new
            );

            expect(_wrapCall('foo', 'bar')).to.not.throw(errorMessage);

            expect(_wrapCall()).to.throw(Error, errorMessage);
            ['', null, 0].forEach((wrongArg) => {
                expect(_wrapCall(wrongArg, wrongArg)).to.throw(Error, errorMessage);
                expect(_wrapCall('foo', wrongArg)).to.throw(Error, errorMessage);
                expect(_wrapCall(wrongArg, 'bar')).to.throw(Error, errorMessage);
            });
        });
    });
});
