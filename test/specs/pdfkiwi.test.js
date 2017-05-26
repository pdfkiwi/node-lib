const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock           = require('nock');
const Pdfkiwi        = require('../../src/pdfkiwi');
const PdfkiwiError   = require('../../src/pdfkiwi-error');
const qs             = require('qs').stringify;

chai.use(chaiAsPromised);
const expect = chai.expect;

describe(`Pdfkiwi`, () => {
    const apiUrl = 'https://pdf.kiwi';

    afterEach(() => {
        nock.cleanAll();
    });

    const _basicMock = () => {
        /* eslint-disable newline-per-chained-call */
        nock(apiUrl)
            .persist()
            .filteringPath(/.*/, '/')
            .intercept('/', 'GET').reply(200)
            .intercept('/', 'POST').reply(200)
            .intercept('/', 'DELETE').reply(200);
        /* eslint-enable newline-per-chained-call */
    };

    const _toBuffer = str => Buffer.from(str, 'utf8');

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

    describe('.convertHtml()', () => {
        let client;
        before(() => {
            client = new Pdfkiwi('foo', 'bar');
        });

        it(`should be callable`, () => {
            expect(client).to.respondTo('convertHtml');
        });

        it(`should throw and error when called with invalid or missing html parameter`, () => {
            _basicMock();

            const promises  = [];
            const _wrapCall = src => (
                () => {
                    // eslint-disable-next-line no-new
                    promises.push(client.convertHtml(src, {}).catch(() => {}));
                }
            );

            const emptyErrorMessage = /No HTML provided/;
            expect(_wrapCall()).to.throw(Error, emptyErrorMessage);
            ['', null].forEach((wrongArg) => {
                expect(_wrapCall(wrongArg)).to.throw(Error, emptyErrorMessage);
            });

            const invalidErrorMessage = /Invalid HTML string/;
            [Infinity, {}].forEach((wrongArg) => {
                expect(_wrapCall(wrongArg)).to.throw(TypeError, invalidErrorMessage);
            });

            ['<h1>foo</h1>', 'text', 0, 10, 1.5].forEach((correctArg) => {
                expect(_wrapCall(correctArg)).to.not.throw(emptyErrorMessage);
                expect(_wrapCall(correctArg)).to.not.throw(invalidErrorMessage);
            });

            return Promise.all(promises);
        });

        it(`should throw an error when called with invalid options parameter`, () => {
            _basicMock();

            const promises     = [];
            const errorMessage = /Invalid options object/;
            const _wrapCall    = (...args) => (
                () => {
                    // eslint-disable-next-line no-new
                    promises.push(client.convertHtml(...args).catch(() => {}));
                }
            );

            expect(_wrapCall('<h1>Test</h1>')).to.not.throw(errorMessage);
            expect(_wrapCall('<h1>Test</h1>', {})).to.not.throw(errorMessage);
            expect(_wrapCall('<h1>Test</h1>', { a: 'b', c: 'd' })).to.not.throw(errorMessage);

            // eslint-disable-next-line no-new-wrappers
            ['text', 1, new Number(1)].forEach((wrongArg) => {
                expect(_wrapCall('<h1>Test</h1>', wrongArg)).to.throw(TypeError, errorMessage);
            });

            return Promise.all(promises);
        });

        it(`should return a promise`, () => {
            _basicMock();

            const convert = client.convertHtml('foo').catch(() => {});

            expect(convert).to.be.instanceof(Promise);
            expect(convert.then).to.be.a('function');
            expect(convert.catch).to.be.a('function');

            return convert;
        });

        it(`should call the PDF.kiwi API with correct request`, () => {
            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/', qs({ email: 'foo', token: 'bar', html: `test` }))
                .reply(200);

            return expect(client.convertHtml(`test`)).to.be.fulfilled;
        });

        it(`should allow to pass custom options to the PDF.kiwi API call`, () => {
            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/', qs({
                    email   : 'foo',
                    token   : 'bar',
                    html    : `test`,
                    options : { foo: 'bar', bar: 'baz' }
                }))
                .reply(200);

            return expect(client.convertHtml(`test`, { foo: 'bar', bar: 'baz' })).to.be.fulfilled;
        });

        it(`should return the html converted to pdf from the API`, () => {
            const promises = [];

            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/', qs({
                    email : 'foo',
                    token : 'bar',
                    html  : `<span class="test">Foo</span>`
                }))
                .reply(200, `--PDF <span class="test">Foo</span>--`);

            promises.push(
                expect(client.convertHtml('<span class="test">Foo</span>'))
                    .to.be.fulfilled
                    .and.become(_toBuffer(`--PDF <span class="test">Foo</span>--`))
            );

            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/', qs({
                    email   : 'foo',
                    token   : 'bar',
                    html    : `<h1>Bar</h1>`,
                    options : { foo: 'bar' }
                }))
                .reply(200, `--PDF <h1>Bar</h1> foo:bar--`);

            promises.push(
                expect(client.convertHtml('<h1>Bar</h1>', { foo: 'bar' }))
                    .to.be.fulfilled
                    .and.become(_toBuffer(`--PDF <h1>Bar</h1> foo:bar--`))
            );

            return Promise.all(promises);
        });

        it(`should take in charge unstandardized errors`, () => {
            const promises = [];

            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/')
                .replyWithError('{an error}');

            promises.push(
                expect(client.convertHtml('test'))
                    .to.be.rejectedWith(PdfkiwiError, /{an error}/)
            );

            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/')
                .reply(404, '{a weird unformatted error}');

            promises.push(
                expect(client.convertHtml('test'))
                    .to.be.rejectedWith(PdfkiwiError, /Unknown API error: {a weird unformatted error}/)
            );

            nock(apiUrl, { encodedQueryParams: true })
                .post('/api/generator/render/')
                .reply(500, { invalid: 'error' });

            promises.push(
                expect(client.convertHtml('test'))
                    .to.be.rejectedWith(PdfkiwiError, /Unknown API error: {"invalid":"error"}/)
            );

            return Promise.all(promises);
        });

        it(`should report correctly API errors`, () => {
            const promises = [];

            nock(apiUrl)
                .post('/api/generator/render/')
                .reply(500, {
                    success : false,
                    error   : { code: 10, message: `{error message}` }
                });

            promises.push(
                expect(client.convertHtml('test'))
                    .to.be.rejectedWith(PdfkiwiError, /{error message} \(code: 10\)/)
            );

            nock(apiUrl)
                .post('/api/generator/render/')
                .reply(400, {
                    success : false,
                    error   : { code: 5 }
                });

            promises.push(
                expect(client.convertHtml('test'))
                    .to.be.rejectedWith(PdfkiwiError, /API error occurred, see the code. \(code: 5\)/)
            );

            return Promise.all(promises);
        });

        it(`should not be impacted by options object modifications after being called`, () => {
            const promises = [];

            nock(apiUrl, { encodedQueryParams: true })
                .persist()
                .post('/api/generator/render/', qs({
                    email   : 'foo',
                    token   : 'bar',
                    html    : `test`,
                    options : { foo: 'bar' }
                }))
                .reply(200, 'ok-1');

            nock(apiUrl, { encodedQueryParams: true })
                .persist()
                .post('/api/generator/render/', qs({
                    email   : 'foo',
                    token   : 'bar',
                    html    : `test`,
                    options : { foo: 'bar', baz: 'buz' }
                }))
                .reply(200, 'ok-2');

            const options = { foo: 'bar' };
            promises.push(
                expect(client.convertHtml(`test`, options)).to.become(_toBuffer('ok-1')),
                expect(client.convertHtml(`test`, options)).to.become(_toBuffer('ok-1'))
            );

            options.baz = 'buz';
            promises.push(
                expect(client.convertHtml(`test`, options)).to.become(_toBuffer('ok-2'))
            );

            return Promise.all(promises);
        });

        it(`should execute one request at a time`, function () {
            this.timeout(3000);

            const promises   = [];
            const _doRequest = () => {
                const mock = nock(apiUrl)
                    .post('/api/generator/render/')
                    .reply(200);

                promises.push(client.convertHtml(`test`));
                return mock;
            };

            let firstRequestFinished  = false;
            let secondRequestFinished = false;

            _doRequest().on('replied', () => { firstRequestFinished = true; });

            _doRequest()
                .on('request', () => { expect(firstRequestFinished).to.be.true; })
                .on('replied', () => { secondRequestFinished = true; });

            _doRequest()
                .on('replied', () => { expect(secondRequestFinished).to.be.true; });

            return Promise.all(promises);
        });
    });
});
