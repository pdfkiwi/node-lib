const fs   = require('fs');
const path = require('path');

module.exports = function (filePath) {
    if (!filePath && filePath !== 0) {
        throw new Error(`[sendToFile] No file path provided.`);
    }

    let _filePath = filePath.toString();
    if (!path.extname(_filePath)) {
        _filePath += '.pdf';
    }
    _filePath = path.resolve(_filePath);

    return data => (
        new Promise((resolve, reject) => {
            fs.writeFile(_filePath, data, err => (err ? reject(err) : resolve()));
        })
    );
};
