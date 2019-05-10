import * as pd from '../../../stencil.core/dist/testing/puppeteer/puppeteer-declarations';
/**
 * Moves a reorder item by simulating a drag event
 */
export declare function moveReorderItem(id: string, page: pd.E2EPage, direction?: 'up' | 'down', numberOfSpaces?: number, ...parentSelectors: string[]): Promise<void>;
