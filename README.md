# pdfkiwi-node

> A node library for interacting with [pdf.kiwi](https://pdf.kiwi) API

[![Build Status](https://travis-ci.org/pdfkiwi/node-lib.svg?branch=master)](https://travis-ci.org/pdfkiwi/node-lib)
[![Coverage Status](https://coveralls.io/repos/github/pdfkiwi/node-lib/badge.svg?branch=master)](https://coveralls.io/github/pdfkiwi/node-lib?branch=master)

## Installation

```bash
# - Npm
npm install pdfkiwi --save

# - Yarn
yarn add pdfkiwi
```

## Usage

Start by instantiating a client instance:

```js
const pdf = require('pdfkiwi');

const client = new pdf.Pdfkiwi('[api email]', ['api token']);
```

You can then use any of the methods described below.

- Available options (for the `options` parameters) are listed on [this page](https://doc.pdf.kiwi/options-list.html).
- API error codes are listed on [this page](https://doc.pdf.kiwi/error-codes.html).
- All of these methods return a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
- The promise is resolved with a `Buffer` containing the PDF binary data,  
  You can use built-in utility functions to save or download the pdf directly.  
  (see [Built-in utility functions](#built-in-utility-functions))

### `.convertHtml()` - Convert HTML string to PDF

```js
Pdfkiwi.convertHtml(html: String|Number, options: Object): Promise
```

__Exemple:__

```js
client.convertHtml('<h1>Hello world</h1>', { orientation: 'landscape' })
    .then(pdf.saveToFile('./my-pdf-file.pdf'))
    .then(() => { console.log('done !'); })
    .catch((err) => {
        // err.code   : Api error code (if available)
        // err.status : Http code (if available)
        console.log(err);
    });
```

## Built-in utility functions

### `pdf.saveToFile()` — Saves the generated PDF to a file.

```js
pdf.saveToFile(filePath: String): Function
```

- If the `filePath` has no extension, the `.pdf` extension will be automatically appended.
- The `filePath` path is resolved regarding the current working directory.

__Exemple:__

```js
client.convertHtml('<h1>Hello world</h1>')
    .then(pdf.saveToFile('/path/to/my-file.pdf'))
    .catch((err) => { console.log(err); });
```

### `pdf.sendHttpResponse()` — Returns the generated PDF in an HTTP [response](https://nodejs.org/docs/latest/api/http.html#http_class_http_serverresponse).

```js
pdf.sendHttpResponse(response: http.ServerResponse, fileName: String): Function
```

- If the `fileName` has no extension, the `.pdf` extension will be automatically appended.

__Exemple:__

```js
const express = require('express');
const app = express();

app.get('/pdf', (request, response) => {
    client.convertHtml('<h1>Hello world</h1>')
        .then(pdf.sendHttpResponse(response, 'my-file'))
        .catch((err) => { console.log(err); });
});

app.listen(3000);
```

## Useful links

- https://pdf.kiwi
- https://doc.pdf.kiwi — API Documentation
