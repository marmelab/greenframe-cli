const { Page } = require('playwright');
const { test, expect } = require('@playwright/test');
const maVar1 = process.env.GREENFRAME_MA_VAR;
const maVar2 = process.env.GREENFRAME_MA_VAR_DEUZE;

const visit = async (page) => {
    expect(maVar1).toBe('bip');
    expect(maVar2).toBe('bop');
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToEnd();
};

module.exports = visit;
