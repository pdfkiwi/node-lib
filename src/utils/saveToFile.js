const fs   = require('fs');
const path = require('path');

module.exports = function (filePath) {
    let _filePath = path.resolve(filePath);
    if (!path.extname(_filePath)) {
        _filePath += '.pdf';
    }

    return data => (
        new Promise((resolve, reject) => {
            fs.writeFile(_filePath, data, err => (err ? reject(err) : resolve()));
        })
    );
};
