const {join} = require('path');
const { DocxEvid } = require('wdio-docx-evid');
const moment = require('moment');

let os = require('os');
let cap;
let timestamp = moment(new Date()).format('DDMMYYhhmmss');

if (os.platform().substr(0, 3).toLowerCase() === 'win')
    cap = ['--window-size=1366,768', '--no-sandbox', '--disable-infobars', '--disable-extensions', '--lang=en'];
else
    cap = ['--headless', '--disable-gpu', '--window-size=1366,768', '--no-sandbox', '--disable-infobars', '--disable-extensions', '--lang=en'];

exports.config = {
    runner: 'local',
    path: '/',
    specs: [
        'test/specs/*.js'
    ],

    suites: {
        tests: [
            './test/specs/*.js'
        ],
    },
    maxInstances: 10,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: cap,
            prefs: {
                credentials_enable_service: false,
                'plugins.always_open_pdf_externally': true,
                'profile.managed_default_content_settings.popups': 1,
                'profile.managed_default_content_settings.notifications': 1,
                'profile.password_manager_enabled': false,
            }
        },
    }],
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'debug',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    outputDir: './test-report/output',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: './test-report/allure-results/',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
            },
        ],
        [DocxEvid, {
            timestamp: timestamp,
            outputDir: './output/',
            template: './template/template.docx'
        }
        ],
    ],
    services: [
        [
            'image-comparison',
            {
                baselineFolder: join(process.cwd(), './screenshots/reference/'),
                formatImageName: '{tag}-{logName}-{width}x{height}',
                screenshotPath: join(process.cwd(), './screenshots/'),
                savePerInstance: true,
                autoSaveBaseline: true,
                blockOutStatusBar: true,
                blockOutToolBar: true,
            },
        ],
        ['chromedriver'],
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 1200000
    },
    afterTest: function (test) {
        if (test.error !== undefined) {
            browser.takeScreenshot();
        }
    },
};
