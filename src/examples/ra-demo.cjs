const raDemo = async (page) => {
    // Go to http://localhost:3000/
    await page.goto('#/login', {
        waitUntil: 'networkidle',
    });
    await page.waitForTimeout(1000);

    await page.scrollToElement('input[name="username"]'); // Click input[name="username"]
    await page.click('input[name="username"]');

    // Fill input[name="username"]
    await page.scrollToElement('input[name="username"]');
    await page.type('input[name="username"]', 'demo');

    await page.scrollToElement('input[name="password"]'); // Click input[name="password"]
    await page.click('input[name="password"]');

    // Fill input[name="password"]
    await page.scrollToElement('input[name="password"]');
    await page.type('input[name="password"]', 'demo');

    await page.scrollToElement('button:has-text("Sign in")'); // Click button:has-text("Sign in")
    await page.click('button:has-text("Sign in")');

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=PostersPosters'),
        page.click('text=PostersPosters'),
    ]);

    await page.waitForTimeout(1000);
    await page.scrollToElement('text=Aerial Coast');
    await page.click('text=Aerial Coast');

    await page.scrollToElement('text=Details');
    await page.click('text=Details');

    await page.scrollToElement('input[name="reference"]');
    await page.click('input[name="reference"]');

    await page.scrollToElement('input[name="reference"]');
    await page.type('input[name="reference"]', ' Test');

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('[aria-label="Save"]'),
        page.click('[aria-label="Save"]'),
    ]);

    await page.scrollToElement('input[name="q"]');
    await page.click('input[name="q"]');

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('input[name="q"]'),
        page.type('input[name="q"]', 'Aerial'),
    ]);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=CategoriesCategories'),
        page.click('text=CategoriesCategories'),
    ]);

    await page.waitForTimeout(1000);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('[aria-label="Edit"]'),
        page.click('[aria-label="Edit"]'),
    ]);

    await page.scrollToElement('input[name="name"]');
    await page.click('input[name="name"]');

    // Press a with modifiers
    await page.scrollToElement('input[name="name"]');
    await page.press('input[name="name"]', 'Control+a');

    await page.scrollToElement('input[name="name"]');
    await page.type('input[name="name"]', 'Cats');

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('[aria-label="Save"]'),
        page.click('[aria-label="Save"]'),
    ]);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=CustomersCustomers'),
        page.click('text=CustomersCustomers'),
    ]);

    await page.scrollToElement('input[name="q"]'); // Click input[name="q"]
    await page.click('input[name="q"]');

    // Fill input[name="q"]
    await Promise.all([
        page.waitForNavigation({
            /* url: 'http://localhost:3000/#/customers?filter=%7B%22q%22%3A%22H%22%7D&order=DESC&page=1&perPage=25&sort=last_seen', */ waitUntil:
                'networkidle',
        }),
        page.scrollToElement('input[name="q"]'),
        page.type('input[name="q"]', 'H'),
    ]);

    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.scrollToElement('text=ReviewsReviews'),
        page.click('text=ReviewsReviews'),
    ]);

    await page.waitForTimeout(1000);

    await page.scrollToElement('input[type="checkbox"]');
    await page.check('input[type="checkbox"]');

    await page.scrollToElement('[aria-label="Delete"]');
    await page.click('[aria-label="Delete"]');
    await page.waitForNetworkIdle();
};

module.exports = raDemo;
