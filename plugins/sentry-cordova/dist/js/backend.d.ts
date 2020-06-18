import { BrowserOptions } from '@sentry/browser';
import { BaseBackend } from '@sentry/core';
import { Event, EventHint, Severity } from '@sentry/types';
import { SyncPromise } from '@sentry/utils';
/**
 * Configuration options for the Sentry Cordova SDK.
 * @see CordovaFrontend for more information.
 */
export interface CordovaOptions extends BrowserOptions {
    /**
     * Enables crash reporting for native crashes.
     * Defaults to `true`.
     */
    enableNative?: boolean;
}
/** The Sentry Cordova SDK Backend. */
export declare class CordovaBackend extends BaseBackend<BrowserOptions> {
    protected readonly _options: CordovaOptions;
    private readonly _browserBackend;
    private readonly _deviceReadyCallback?;
    /** Creates a new cordova backend instance. */
    constructor(_options?: CordovaOptions);
    /**
     * @inheritDoc
     */
    eventFromException(exception: any, hint?: EventHint): SyncPromise<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(message: string, level?: Severity, hint?: EventHint): SyncPromise<Event>;
    /**
     * @inheritDoc
     */
    sendEvent(event: Event): void;
    /**
     * Uses exec to call cordova functions
     * @param action name of the action
     * @param args Arguments
     */
    private _nativeCall;
    /**
     * Calling into native install function
     */
    private _runNativeInstall;
    /**
     * Has cordova on window?
     */
    private _isCordova;
}
//# sourceMappingURL=backend.d.ts.map