# wdio-docx-evid

wdio-docx-evid is a Javascript library to generate test evidence documents

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install.

```bash
npm i wdio-docx-evid
```
Add in wdio.conf.js

```javascript
const { DocxEvid } = require('wdio-docx-evid');


[DocxEvid, {
  timestamp: timestamp,
  outputDir: './output/',
  template: './template/template.docx'
  }
],
```

## Usage

```javascript

browser.takeScreenshot();
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
