const greenframe = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.addMilestone('Go Solutions');
    await Promise.all([
        page.waitForNavigation({
            /* url: 'https://greenframe.io/', */ waitUntil: 'networkidle',
        }),
        page.scrollToElement('text=Try it for free'),
        page.click('text=Try it for free'),
    ]);
    await page.addMilestone('Go Back home');

    await page.goto('', {
        waitUntil: 'networkidle',
    });
};

module.exports = greenframe;
