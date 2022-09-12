async (page) => {
    await page.addMilestone('Go onepage');
    await page.goto('/onepage', {
        waitUntil: 'networkidle',
    });
    await page.waitForTimeout(2000);
};
