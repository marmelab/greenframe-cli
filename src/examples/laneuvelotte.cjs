const laneuvelotte = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    // Click text=Actualités
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Actualités'),
        page.click('text=Actualités'),
    ]);
    // Click text=Deuxième confinement
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Deuxième confinement'),
        page.click('text=Deuxième confinement'),
    ]);
    // assert.equal(page.url(), 'https://laneuvelotte.fr/2020/11/deuxieme-confinement/');
    // Click text=Voir tous les articles par Yann GENSOLLEN
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=Voir tous les articles par Yann GENSOLLEN'),
        page.click('text=Voir tous les articles par Yann GENSOLLEN'),
    ]);
};

module.exports = laneuvelotte;
