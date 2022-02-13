class MainPageMap {
    getElementByText(text) {
        return $(`//*[normalize-space(text())="${text}"]`);
    }
}

module.exports = MainPageMap;