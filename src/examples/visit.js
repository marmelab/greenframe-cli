const visit = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToEnd();
};

module.exports = visit;
