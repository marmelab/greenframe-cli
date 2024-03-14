const greenframeFail = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.addMilestone('Go Solutions');
    await Promise.all([
        page.waitForNavigation({
            /* url: 'https://greenframe.io/', */ waitUntil: 'networkidle',
        }),
        page.scrollToElement('text=Tit now'),
        page.click('text=Tit now'),
    ]);
    await page.addMilestone('Go Back home');

    await page.goto('', {
        waitUntil: 'networkidle',
    });
};

module.exports = greenframeFail;
