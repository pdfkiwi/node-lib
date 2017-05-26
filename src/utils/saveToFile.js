const fs   = require('fs');
const path = require('path');

module.exports = function (fileName) {
    let filePath = path.resolve(fileName);
    if (!path.extname(filePath)) {
        filePath += '.pdf';
    }

    return data => (
        new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, err => (err ? reject(err) : resolve()));
        })
    );
};
