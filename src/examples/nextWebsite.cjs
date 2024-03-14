const nextWebsite = async (page) => {
    // Go to https://nextjs.org/
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    // Click text=Read Case Study
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Read Case Study'),
        page.click('text=Read Case Study'),
    ]);
    // Click text=Learn More
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Learn More'),
        page.click('text=Learn More'),
    ]);
    // Click text=Start Now →
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Start Now →'),
        page.click('text=Start Now →'),
    ]);
    // Click a[role="button"]:has-text("Next")
    await Promise.all([
        page.scrollToElement('a[role="button"]:has-text("Next")'),
        page.click('a[role="button"]:has-text("Next")'),
    ]);
    // Click a[role="button"]:has-text("Next")
    await Promise.all([
        page.scrollToElement('a[role="button"]:has-text("Next")'),
        page.click('a[role="button"]:has-text("Next")'),
    ]);
    // Click a[role="button"]:has-text("Next Lesson")
    await Promise.all([
        page.scrollToElement('a[role="button"]:has-text("Next Lesson")'),
        page.click('a[role="button"]:has-text("Next Lesson")'),
    ]);
    // Click text=Start Now →
    await Promise.all([
        page.scrollToElement('text=Start Now →'),
        page.click('text=Start Now →'),
    ]);
};

module.exports = nextWebsite;
