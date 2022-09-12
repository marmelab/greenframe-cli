async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToEnd();
};
