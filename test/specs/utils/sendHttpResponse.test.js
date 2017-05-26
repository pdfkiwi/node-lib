const chai             = require('chai');
const sinon            = require('sinon');
const sinonChai        = require('sinon-chai');
const http             = require('http');
const sendHttpResponse = require('../../../src/utils/sendHttpResponse');

chai.use(sinonChai);
const expect = chai.expect;

describe(`/utils/sendHttpResponse()`, () => {
    it(`should throw an error when called with empty fileName`, () => {
        const errorMessage = /No file name provided/;
        const _wrapCall    = (name = undefined) => (
            () => {
                const response = sinon.createStubInstance(http.ServerResponse);

                // eslint-disable-next-line no-new
                sendHttpResponse(response, name);
            }
        );

        expect(_wrapCall()).to.throw(Error, errorMessage);
        ['', null].forEach((wrongArg) => {
            expect(_wrapCall(wrongArg)).to.throw(Error, errorMessage);
        });

        ['test', 0, 1].forEach((correctArg) => {
            expect(_wrapCall(correctArg)).to.not.throw(errorMessage);
        });
    });

    it(`should throw an error if response is not an instance of http.ServerResponse`, () => {
        const errorMessage = /The response parameter is not a http\.ServerResponse/;
        const _wrapCall    = (response = undefined) => (
            () => {
                // eslint-disable-next-line no-new
                sendHttpResponse(response, 'test');
            }
        );

        expect(_wrapCall({})).to.throw(Error, errorMessage);

        const response = sinon.createStubInstance(http.ServerResponse);
        expect(_wrapCall(response)).to.not.throw(errorMessage);
    });

    it(`should return a function`, () => {
        const response = sinon.createStubInstance(http.ServerResponse);
        expect(sendHttpResponse(response, 'my-file.pdf')).to.be.instanceof(Function);
    });

    it(`should set correct headers and send the request with right content`, () => {
        const response = sinon.createStubInstance(http.ServerResponse);
        sendHttpResponse(response, 'my-file.pdf')('abc');

        expect(response.setHeader).to.be.calledWith('Content-Type', 'application/pdf');
        expect(response.setHeader).to.be.calledWithMatch('Content-Disposition', /^attachment;/);
        expect(response.end).to.be.calledWith('abc');
    });

    it(`should set the right file name`, () => {
        ['my-file.pdf', 'wéir(d)-."filename.pdf'].forEach((fileName) => {
            const response = sinon.createStubInstance(http.ServerResponse);
            sendHttpResponse(response, fileName)('abc');

            expect(response.setHeader).to.be.calledWithMatch(
                'Content-Disposition',
                `filename="${encodeURIComponent(fileName)}"`
            );
        });
    });

    it(`should add .pdf extension automatically if fileName has no extension`, () => {
        const response = sinon.createStubInstance(http.ServerResponse);
        sendHttpResponse(response, 'file')('abc');

        expect(response.setHeader).to.be.calledWithMatch('Content-Disposition', /filename="file.pdf"/);
    });
});
