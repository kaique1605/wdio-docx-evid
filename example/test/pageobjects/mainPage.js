const Constants = require('../core/constants');
const assert = require('assert');
const BasePage = require('./basePage');
const BasicError = require('../exceptions/basicError');
const MainPageMap = require('../uimaps/mainPageMap');

let mainPageMap = new MainPageMap();

class MainPage extends BasePage {

    clickElementByText(text) {
        try {
            this.click(mainPageMap.getElementByText(text));
            browser.takeScreenshot();
        } catch (err) {
            assert.fail(new BasicError('Fail on click element ' + text, err));
        }
    }

    validateElementByText(text) {
        try {
            this.waitElement(mainPageMap.getElementByText(text), Constants.TIME_OUT_WAIT_ELEMENT);
            browser.takeScreenshot();
        } catch (err) {
            assert.fail(new BasicError('Fail on wait element ' + text, err));
        }
    }

    validateNotExistence(text) {
        try {
            this.waitElementDisappear(mainPageMap.getElementByText(text), Constants.TIME_OUT_WAIT_ELEMENT_MIN);
        } catch (err) {
            assert.fail(new BasicError('Fail on validate not existence ' + text, err));
        }
    }

    navigate(url) {
        try {
            super.navigate(url);
        } catch (err) {
            assert.fail(new BasicError('Fail on navigate to URL ' + url, err));
        }
    }

}

module.exports = MainPage;