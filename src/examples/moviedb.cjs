const moviedb = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.waitForTimeout(5000);
    await page.scrollToElement('text="Luca"');
    await page.click('text="Luca"');
    await page.waitForTimeout(3000);
};

module.exports = moviedb;
