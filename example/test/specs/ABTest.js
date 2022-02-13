const MainPage = require('../pageobjects/mainPage');

let mainPage = new MainPage();

describe('Validate page A/B Testing', function () {
    it('Access page', function () {
        browser.maximizeWindow();
        mainPage.navigate('https://the-internet.herokuapp.com/');
        mainPage.clickElementByText("A/B Testing");
        mainPage.validateElementByText("A/B Test Control");
    });

});