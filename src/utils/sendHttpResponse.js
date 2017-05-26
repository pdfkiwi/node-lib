const http = require('http');
const path = require('path');

module.exports = function (response, fileName) {
    if (!response || !(response instanceof http.ServerResponse)) {
        throw new Error(`[sendHttpResponse] The response parameter is not a http.ServerResponse.`);
    }

    if (!fileName && fileName !== 0) {
        throw new Error(`[sendHttpResponse] No file name provided.`);
    }

    let _fileName = encodeURIComponent(fileName.toString());
    if (!path.extname(_fileName)) {
        _fileName += '.pdf';
    }

    return (data) => {
        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Cache-Control', 'max-age=0');
        response.setHeader('Accept-Ranges', 'none');
        response.setHeader('Content-Disposition', `attachment; filename="${_fileName}"`);
        response.end(data);
    };
};
