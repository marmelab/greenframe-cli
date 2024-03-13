const lavolpiliere = async (page) => {
    // Go to https://la-volpiliere.com/blog/chambre-dhotes/
    await page.goto('/blog/chambre-dhotes/', {
        waitUntil: 'networkidle',
    });
    // Click text=Le Blog
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Le Blog'),
        page.click('text=Le Blog'),
    ]);
    // assert.equal(page.url(), 'https://la-volpiliere.com/blog/');
    // Click #post-3142 >> text=1ère balade de l’année 2021
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('#post-3142 >> text=1ère balade de l’année 2021'),
        page.click('#post-3142 >> text=1ère balade de l’année 2021'),
    ]);
    // assert.equal(page.url(), 'https://la-volpiliere.com/blog/1ere-balade-de-lannee-2021/');
};

module.exports = lavolpiliere;
