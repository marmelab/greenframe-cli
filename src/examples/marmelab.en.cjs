const marmelabEN = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement("text=LET'S WORK TOGETHER ON YOUR NEXT PROJECT!");
};

module.exports = marmelabEN;
