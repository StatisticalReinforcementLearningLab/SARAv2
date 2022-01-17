import { BaseClient, Scope } from '@sentry/core';
import { Event, EventHint } from '@sentry/types';
import { SyncPromise } from '@sentry/utils';
import { CordovaBackend, CordovaOptions } from './backend';
/**
 * The Sentry Cordova SDK Client.
 *
 * @see CordovaOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export declare class CordovaClient extends BaseClient<CordovaBackend, CordovaOptions> {
    /**
     * Creates a new Cordova SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: CordovaOptions);
    /**
     * @inheritDoc
     */
    protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): SyncPromise<Event | null>;
}
//# sourceMappingURL=client.d.ts.map