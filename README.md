# pdfkiwi-node

> A node library for interacting with [Pdf.kiwi](https://pdf.kiwi) API

[![Build Status](https://travis-ci.org/pdfkiwi/node-lib.svg?branch=master)](https://travis-ci.org/pdfkiwi/node-lib)
[![Coverage Status](https://coveralls.io/repos/github/pdfkiwi/node-lib/badge.svg?branch=master)](https://coveralls.io/github/pdfkiwi/node-lib?branch=master)

## Installation

```bash
# - Npm
npm install pdfkiwi-node --save

# - Yarn
yarn add pdfkiwi-node
```

## Usage

Start by instantiating a client instance:

```js
const Pdfkiwi = require('pdfkiwi');

const client = new Pdfkiwi('[api email]', ['api token']);
```

You can then use any of the methods described below.

- Available options (for the `options` parameters) are listed on [this page](https://doc.pdf.kiwi/options-list.html).
- API error codes are listed on [this page](https://doc.pdf.kiwi/error-codes.html).
- All of these methods return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
- The promise is resolved with a `Buffer` containing the PDF binary data,  
  You can use built-in utility functions to save or download the pdf directly.  
  (see [Built-in utility functions](#builtin-functions))

### `.convertHtml()` - Convert HTML string to PDF

```js
Pdfkiwi.convertHtml(html: String|Number, options: Object): Promise
```

__Exemple:__

```js
client.convertHtml('<h1>Hello world</h1>', { orientation: 'landscape' })
    .then((pdf) => {
        // pdf === PDF Binary data
    })
    .catch((err) => {
        // err.code   : Api error code.
        // err.status : Http code
        console.log(err.message);
    });
```

## <a name="builtin-functions"></a>Built-in utility functions

### `pdf.saveToFile()` — Create a PDF from PDF binary data

```js
pdf.saveToFile(fileName: String): Function
```

- If the fileName has no extension, the `.pdf` extension will be automatically appended.
- The fileName is resolved regarding the current working directory.

__Exemple:__

```js
client.convertHtml('<h1>Hello world</h1>')
    .then(pdf.saveToFile('/path/to/my-file.pdf'))
    .catch((err) => { console.log(err); })
```

## Useful links

- https://pdf.kiwi
- http://doc.pdf.kiwi — API Documentation
