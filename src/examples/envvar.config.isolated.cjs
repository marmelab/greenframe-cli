const { expect } = require('@playwright/test');
const myVar1 = process.env.GREENFRAME_MY_VAR_ONE;
const myVar2 = process.env.GREENFRAME_MY_VAR_TWO;

const visit = async (page) => {
    expect(myVar1).toBe('inline_value_one');
    expect(myVar2).toBe('defined_value_two');
    await page.goto('', {
        waitUntil: 'networkidle',
    });
    await page.scrollToEnd();
};

module.exports = visit;
