const Constants = require('../core/constants');
const {isBlank} = require('../utils/functionUtils');

class BasePage {

    /**
     * Wait element displayed and enabled
     * @param {*} element Element to wait
     * @param {*} timeMs Time max to wait
     */
    waitElement(element, timeMs) {
        element.waitForExist(timeMs);
        element.waitForDisplayed(timeMs);
        element.waitForEnabled(timeMs);
    }

    /**
     * Wait element disappear
     * @param {*} element Element to wait disappear
     * @param {*} timeMs Time max to wait
     */
    waitElementDisappear(element, timeMs) {
        element.waitForDisplayed(timeMs, true, 'Fail to wait element dissapear');
    }

    /**
     * Click on element
     * @param {*} element Element to be clicked
     */
    click(element) {
        this.waitElement(element, Constants.TIME_OUT_WAIT_ELEMENT);
        browser.pause(500);
        element.click();
    }

    /**
     * Click on element
     * @param {*} element Element to be clicked
     */
    clickWithScroll(element) {
        this.waitElement(element, Constants.TIME_OUT_WAIT_ELEMENT);
        browser.pause(500);
        this.scrollToElement(element);
        element.click();
    }

    /**
     * Set value on element
     * @param {*} element
     * @param {*} value
     */
    setValue(element, value) {
        this.waitElement(element, Constants.TIME_OUT_WAIT_ELEMENT);
        this.scrollToElement(element);
        element.clearValue();
        element.setValue(value);
    }

    getText(element) {
        this.waitElement(element, Constants.TIME_OUT_WAIT_ELEMENT);
        return element.getText();
    }

    getValue(element) {
        this.waitElement(element, Constants.TIME_OUT_WAIT_ELEMENT);
        return element.getValue();
    }

    scrollToElement(element) {
        element.scrollIntoView();
    }

    isBlank(data) {
        return isBlank(data);
    }

    navigate(url){
        browser.url(url);
    }

}

module.exports = BasePage;