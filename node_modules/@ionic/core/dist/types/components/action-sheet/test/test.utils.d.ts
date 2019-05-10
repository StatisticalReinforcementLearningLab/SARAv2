export declare function testActionSheet(type: string, selector: string, rtl?: boolean, afterScreenshotHook?: (..._args: any[]) => Promise<void>): Promise<void>;
export declare function testActionSheetBackdrop(page: any, screenshotCompares: any, actionSheet: any): Promise<void>;
export declare function testActionSheetAlert(page: any, screenshotCompares: any): Promise<void>;
