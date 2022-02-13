const MainPage = require('../pageobjects/mainPage');

let mainPage = new MainPage();

describe('Add/Remove Elements', function () {
    it('Add element and Delete', function () {
        browser.maximizeWindow();
        mainPage.navigate('https://the-internet.herokuapp.com/');
        mainPage.clickElementByText("Add/Remove Elements");
        mainPage.clickElementByText("Add Element");
        mainPage.clickElementByText("Delete");
        mainPage.validateNotExistence("Delete");
    });

});