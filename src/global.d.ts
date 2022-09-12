import type { Page as PlaywrightPage } from 'playwright';

declare module 'playwright' {
    export interface Page extends PlaywrightPage {
        _milestones: Milestone[];
        addMilestone(title: string): Page;
        getMilestones(): Milestone[];
        waitForNavigation(
            options?: Parameters<PlaywrightPage['waitForNavigation']>[0] & {
                path?: string;
            }
        ): ReturnType<PlaywrightPage['waitForNavigation']>;

        waitForNetworkIdle(
            options?: Parameters<PlaywrightPage['waitForLoadState']>[1]
        ): ReturnType<PlaywrightPage['waitForLoadState']>;
        scrollToElement(selector: Parameters<Page['$eval']>[0]): Promise<void>;
        scrollToEnd: () => Promise<void>;
        scrollByDistance(distance: number): Promise<void>;
    }

    interface Milestone {
        title: string;
        timestamp: number;
    }
}
