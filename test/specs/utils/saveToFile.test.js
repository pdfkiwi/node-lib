const chai       = require('chai');
const chaiFs     = require('chai-fs');
const mockFs     = require('mock-fs');
const saveToFile = require('../../../src/utils/saveToFile');

const expect = chai.expect;
chai.use(chaiFs);

describe(`/utils/saveToFile()`, () => {
    beforeEach(() => {
        mockFs();
    });

    afterEach(() => {
        mockFs.restore();
    });

    it(`should throw an error when called with empty filePath`, () => {
        const errorMessage = /No file path provided/;
        const _wrapCall    = (filePath = undefined) => (
            () => {
                // eslint-disable-next-line no-new
                saveToFile(filePath);
            }
        );

        expect(_wrapCall()).to.throw(Error, errorMessage);
        ['', null].forEach((wrongArg) => {
            expect(_wrapCall(wrongArg)).to.throw(Error, errorMessage);
        });

        ['/a/b/c.pdf', 'test', 0, 1].forEach((correctArg) => {
            expect(_wrapCall(correctArg)).to.not.throw(errorMessage);
        });
    });

    it(`should return a function`, () => {
        expect(saveToFile('my-file.pdf')).to.be.instanceof(Function);
    });

    it(`should return a promise when returned function is called`, () => {
        const save = saveToFile('my-file.pdf')('abc');
        expect(save).to.be.instanceof(Promise);
        expect(save.then).to.be.a('function');
        expect(save.catch).to.be.a('function');
    });

    it(`should save a file with provided content`, () => {
        const fileName = './my-file.txt';
        return expect(saveToFile(fileName)('abc'))
            .to.be.fulfilled
            .then(() => {
                expect(fileName).to.be.a.file().with.content('abc');
            });
    });

    it(`should add .pdf extension automatically if filename has no extension`, () => {
        const promises = [];
        const _doSave  = (fileName, expectedFileName) => {
            const promise = expect(saveToFile(fileName)('abc'))
                .to.be.fulfilled
                .then(() => {
                    expect(expectedFileName).to.be.a.file();
                });

            promises.push(promise);
        };

        _doSave('my-file.txt', 'my-file.txt');
        _doSave('my-file', 'my-file.pdf');
        _doSave(0, '0.pdf');

        return Promise.all(promises);
    });

    it(`should reject the promise if the file has not been saved`, () => (
        expect(saveToFile('/unknown/path/test-file')('abc')).to.be.rejected
    ));
});
