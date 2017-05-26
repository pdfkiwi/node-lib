const PQueue = require('p-queue');

module.exports = new PQueue({ concurrency: 1 });
