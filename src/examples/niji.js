async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('footer');
    await page.addMilestone('Go to Offres');
    await page.click('text=Offres', { waitUntil: 'networkidle' });

    await page.addMilestone('Go Back home');
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('footer');

    await page.addMilestone('Go To Société');
    await page.click('text=Société', { waitUntil: 'networkidle' });
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('footer');

    await page.addMilestone('Go To Offres');
    await page.click('text=Offres', { waitUntil: 'networkidle' });
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('footer');
};
