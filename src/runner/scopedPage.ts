import { Page } from 'playwright';
import { URL } from 'node:url';
import ConfigurationError from '../services/errors/ConfigurationError';

const getScopedPage = (page: Page, baseUrl: string) => {
    if (!baseUrl) {
        throw new ConfigurationError('You must provide a base url!');
    }

    const waitForNetworkIdle = (options: Parameters<Page['waitForLoadState']>[1] = {}) =>
        page.waitForLoadState('networkidle', options);

    const scrollToElement = (element: Parameters<Page['$eval']>[0]) =>
        page.$eval(element, (element) =>
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        );

    const scrollByDistance = (distance: number) =>
        page.evaluate(
            ([distance]) => {
                window.scrollTo({
                    top: window.scrollY + distance,
                    behavior: 'smooth',
                });
            },
            [distance]
        );

    const scrollToEnd = () =>
        page.evaluate(async () => {
            const delay = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));
            for (let i = 0; i < document.body.scrollHeight; i += 100) {
                window.scrollTo(0, i);
                await delay(25);
            }
        });

    function addMilestone(this: Page, title: string) {
        if (this._milestones.some((m) => m.title === title)) {
            throw new Error(`Milestone "${title}" already exists`);
        }

        this._milestones.push({ title, timestamp: Date.now() });
        return this;
    }

    function getMilestones(this: Page) {
        return this._milestones;
    }

    const resolveURL = (path = '') => {
        const url = new URL(path, baseUrl);
        return url.toString();
    };

    const scopedPage = page as Page;

    scopedPage._milestones = [];

    const originalGoTo = page.goto.bind(scopedPage);
    const originalWaitForNavigation = page.waitForNavigation.bind(scopedPage);

    // Playwright API without some methods

    for (const method of ['addInitScript', 'pdf', 'video', 'screenshot'] as const) {
        scopedPage[method] = () => {
            throw new Error(`Invalid method call "${method}"`);
        };
    }

    // Overrided Playwright API

    scopedPage.goto = (path = '', options = {}) =>
        originalGoTo(resolveURL(path), options);
    scopedPage.waitForNavigation = (options = {}) =>
        originalWaitForNavigation({
            ...options,
            url: options.path ? resolveURL(options.path) : undefined,
        });

    // Custom Greenframe API

    scopedPage.waitForNetworkIdle = waitForNetworkIdle;
    scopedPage.scrollToElement = scrollToElement;
    scopedPage.scrollByDistance = scrollByDistance;
    scopedPage.addMilestone = addMilestone;
    scopedPage.scrollToEnd = scrollToEnd;

    // Internal Greenframe API

    scopedPage.getMilestones = getMilestones;

    return scopedPage;
};

export default getScopedPage;
