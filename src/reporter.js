"use strict";

require("source-map-support/register");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("source-map-support/register");
const fs = require('fs-extra');
const path = require('path');
const logger = require('log4js');
const createReport = require('docx-templates').default;

var _reporter = _interopRequireDefault(require("@wdio/reporter"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function formatName(name){
	return name.replace(/(\s+)/g,'_').replace(/([\_\:]+)([\_\:]+)/g,'-').replace(/[\\/|<>*:"?]+/g, '');
}

class DocxEvid extends _reporter.default {
  constructor(opts) {
    opts = Object.assign({}, {
      stdout: true,
      outputDir: './output',
	  template: './template.docx',
      LOG: null
    }, opts);
    super(opts);
    this.options = opts;

    if (!this.options.LOG) {
      this.options.LOG = logger.getLogger("default");
    }

    this.specName = '';
    this.imgNum = 0;
    this.ctNum = 0;
    this.ctName = '';
    this.imagesTest = [];
    process.on('test:log', this.saveMessage.bind(this));
    process.on('test:screenshot', this.saveScreenshot.bind(this));
  }

  get isSynchronised() {
    return !this.openInProgress;
  }

  log(message, object) {
    if (this.options.LOG || this.options.debug) {
      this.options.LOG.debug(message + object);
    }
  }

  onRunnerStart(runner) {
    this.log("onRunnerStart: ", JSON.stringify(runner)); //todo look at fix, not async safe. but one cid per report file
    this.specName = path.basename(runner.specs[0]).split('.')[0];
  }

  onSuiteStart(suite) {}

  onTestStart(theTest) {
    this.log("onTestStart: ", JSON.stringify(theTest));
    this.ctNum += 1;
    this.ctName = theTest.title;
    this.imgNum = 0;
    this.imagesTest = [];
  }

  onTestPass(test) {
    this.log("onTestPass: ", JSON.stringify(test));
  }

  onTestSkip(test) {
    this.log("onTestSkip: ", JSON.stringify(test));
  }

  onTestFail(test) {
    this.log("onTestFail: ", JSON.stringify(test));
  }

  onHookEnd(hook) {}

  onTestEnd(theTest) {
    this.log("onTestEnd: ", JSON.stringify(theTest));
    this.log('IMAGES TEST: ', JSON.stringify(this.imagesTest));
    let filepath = path.join(this.options.outputDir, this.options.timestamp, this.specName, formatName(this.ctNum + '_' + this.ctName));
    let template = new Buffer.from(fs.readFileSync(this.options.template).buffer);
    let time = msToTime(theTest._duration);
	if(this.imagesTest.length > 0)
		buildReport(filepath, this.ctName, template, this.ctName, time, theTest.state, this.imagesTest);
  }

  isScreenshotCommand(command) {
    const isScreenshotEndpoint = /\/session\/[^/]*\/screenshot/;
    return isScreenshotEndpoint.test(command.endpoint);
  } //this is a hack to get around lack of onScreenshot event


  onAfterCommand(command) {
    if (this.isScreenshotCommand(command) && command.result.value) {
      const filepath = path.join(this.options.outputDir, this.options.timestamp, this.specName, formatName(this.ctNum + '_' + this.ctName), '/screenshots/', this.imgNum + '.png');
      fs.outputFileSync(filepath, Buffer.from(command.result.value, 'base64'));
      this.imagesTest.push({
        path: filepath
      });
      this.imgNum += 1;
    }
  }

  moveErrorsToEvents(test) {
    if (test.errors) {
      for (let i = test.errorIndex; i < test.errors.length; i++) {
        test.events.push({
          type: 'Error',
          ...test.errors[i]
        });
      }

      test.errorIndex = test.errors.length;
    }
  }

  saveScreenshot(filepath) {
    let test = this.getTest(this.testUid);
    this.moveErrorsToEvents(test);
    test.events.push({
      type: 'screenshot',
      value: filepath
    });
  }

  saveMessage(message) {
    const test = this.getTest(this.testUid);
    this.moveErrorsToEvents(test);
    test.events.push({
      type: 'log',
      value: message
    });
  }

}

function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

async function buildReport(evidencePath, nameDoc, template, ctName, timeDuration, state, images) {
  console.info('-- GENERATING DOC ');
  let rep = createReport({
    output: path.join(evidencePath , formatName(nameDoc + '.docx')),
    template: template,
    data: {
      project: {
        "name": ctName,
        "time": timeDuration,
        "status": state,
        "images": images
      }
    }
  });
  rep.then(() => {
    console.info('-- DOC GENERATED');
  });
  await rep;
}

var _default = DocxEvid;
exports.default = _default;