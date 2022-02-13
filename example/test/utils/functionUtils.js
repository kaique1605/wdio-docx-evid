function isBlank(data) {
    return (data === undefined || data === null || data.trim().length <= 0);
}

module.exports = {isBlank};