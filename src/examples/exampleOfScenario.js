async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('footer');
};
