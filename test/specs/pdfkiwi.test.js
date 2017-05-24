const expect  = require('chai').expect;
const Pdfkiwi = require('../../src/pdfkiwi');

describe('Pdfkiwi', () => {
    describe('constructor', () => {
        it(`should throw an error when called with missing API credentials`, () => {
            const errorMessage = /Incomplete Pdf\.kiwi API credentials/;
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

    describe('.convertHtml()', () => {
        it(`should be callable`, () => {
            expect(new Pdfkiwi('foo', 'bar')).to.respondTo('convertHtml');
        });

        it(`should throw an error when called with missing or empty html parameter`, () => {
            const errorMessage = /No HTML provided/;
            const _wrapCall    = src => (
                () => { new Pdfkiwi('foo', 'bar').convertHtml(src, {}); } // eslint-disable-line no-new
            );

            expect(_wrapCall()).to.throw(Error, errorMessage);
            ['', null].forEach((wrongArg) => {
                expect(_wrapCall(wrongArg)).to.throw(Error, errorMessage);
            });

            ['<h1>foo</h1>', 'text', 0].forEach((correctArg) => {
                expect(_wrapCall(correctArg)).to.not.throw(errorMessage);
            });
        });

        it(`should throw an error when called with invalid options parameter`, () => {
            const errorMessage = /Invalid options object/;
            const _wrapCall    = (...args) => (
                () => { new Pdfkiwi('foo', 'bar').convertHtml(...args); } // eslint-disable-line no-new
            );

            expect(_wrapCall('<h1>Test</h1>')).to.not.throw(errorMessage);
            expect(_wrapCall('<h1>Test</h1>', {})).to.not.throw(errorMessage);
            expect(_wrapCall('<h1>Test</h1>', { a: 'b', c: 'd' })).to.not.throw(errorMessage);

            // eslint-disable-next-line no-new-wrappers
            ['text', 1, new Number(1)].forEach((wrongArg) => {
                expect(_wrapCall('<h1>Test</h1>', wrongArg)).to.throw(TypeError, errorMessage);
            });
        });
    });
});
