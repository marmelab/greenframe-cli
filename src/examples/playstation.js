const playstation = async (page) => {
    // Go to https://www.playstation.com/fr-fr/
    await page.goto('/fr-fr/', {
        waitUntil: 'networkidle',
    });
    // Click text=Accept
    await page.scrollToElement('text=Accept');
    await page.click('text=Accept');
    await page.waitForNetworkIdle();
    // Click figcaption:has-text("Manette sans fil DualSense™")
    await page.scrollToElement('figcaption:has-text("Manette sans fil DualSense™")');
    await page.click('figcaption:has-text("Manette sans fil DualSense™")');
    // Click figcaption:has-text("Casque-micro sans fil PULSE 3D™")
    await page.waitForTimeout(500);

    await page.scrollToElement('figcaption:has-text("Casque-micro sans fil PULSE 3D™")');
    await page.click('figcaption:has-text("Casque-micro sans fil PULSE 3D™")');
    // Click figcaption:has-text("Télécommande multimédia")
    await page.waitForTimeout(500);

    await page.scrollToElement('figcaption:has-text("Télécommande multimédia")');
    await page.click('figcaption:has-text("Télécommande multimédia")');
    // Click figcaption:has-text("Caméra HD")
    await page.waitForTimeout(500);
    await page.scrollToElement('figcaption:has-text("Caméra HD")');
    await page.click('figcaption:has-text("Caméra HD")');
    // Click figcaption:has-text("Console PS5")
    await page.waitForTimeout(500);
    await page.scrollToElement('figcaption:has-text("Console PS5")');
    await page.click('figcaption:has-text("Console PS5")');
    // Click a[role="button"]:has-text("Plus d'infos")
    await page.waitForTimeout(500);
    await Promise.all([
        page.waitForNavigation({
            /* url: 'https://www.playstation.com/fr-fr/corporate/about-us/' */ waitUntil:
                'networkidle',
        }),
        page.scrollToElement('a[role="button"]:has-text("Plus d\'infos")'),
        page.click('a[role="button"]:has-text("Plus d\'infos")'),
    ]);

    // assert.equal(page.url(), 'https://www.playstation.com/fr-fr/ps5/');
    // Click .section--lightAlt div div:nth-child(3) .content-grid div .buttonblock .btn-block div .button .cta__primary
    // await Promise.all([
    //     page.waitForNavigation({ /* url: 'https://www.playstation.com/fr-fr/corporate/about-us/', */, waitUntil: 'networkidle' }),
    //     page.click(
    //         '.section--lightAlt div div:nth-child(3) .content-grid div .buttonblock .btn-block div .button .cta__primary'
    //     ),
    // ]);

    // assert.equal(page.url(), 'https://www.playstation.com/fr-fr/games/ratchet-and-clank-rift-apart/');
    // Click text=À propos
    await Promise.all([
        page.waitForNavigation({
            /* url: 'https://www.playstation.com/fr-fr/corporate/about-us/', */ waitUntil:
                'networkidle',
        }),
        page.scrollToElement('text=À propos'),
        page.click('text=À propos'),
    ]);
};

module.exports = playstation;
