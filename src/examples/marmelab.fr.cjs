const marmelabFR = async (page) => {
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToElement('text=TRAVAILLONS ENSEMBLE SUR VOTRE PROCHAIN PROJET !');
};

module.exports = marmelabFR;
