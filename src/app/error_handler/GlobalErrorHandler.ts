import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as StackTrace from 'stacktrace-js';

import * as Sentry from 'sentry-cordova';
import { HttpErrorResponse } from '@angular/common/http';

Sentry.init({
  dsn: "https://b52fab19a7b54657aa485caf384beb23@o408765.ingest.sentry.io/5280045"
  // TryCatch has to be configured to disable XMLHttpRequest wrapping, as we are going to handle
  // http module exceptions manually in Angular's ErrorHandler and we don't want it to capture the same error twice.
  // Please note that TryCatch configuration requires at least @sentry/browser v5.16.0.

  // extra steps for ionic
  // https://docs.sentry.io/platforms/javascript/ionic/

  
});

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  
  constructor() {}

  extractError(error) {
        // Try to unwrap zone.js error.
        // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
        if (error && error.ngOriginalError) {
            error = error.ngOriginalError;
        }

        // We can handle messages and Error objects directly.
        if (typeof error === "string" || error instanceof Error) {
        return error;
        }

        // If it's http module error, extract as much information from it as we can.
        if (error instanceof HttpErrorResponse) {
        // The `error` property of http exception can be either an `Error` object, which we can use directly...
        if (error.error instanceof Error) {
            return error.error;
        }

        // ... or an`ErrorEvent`, which can provide us with the message but no stack...
        if (error.error instanceof ErrorEvent) {
            return error.error.message;
        }

        // ...or the request body itself, which we can use as a message instead.
        if (typeof error.error === "string") {
            return `Server returned code ${error.status} with body "${error.error}"`;
        }

        // If we don't have any detailed information, fallback to the request message itself.
        return error.message;
        }

        // Skip if there's no error, and let user decide what to do with it.
        return null;
    }

    handleError(error) {
        let extractedError = this.extractError(error) || "Handled unknown error";

        // Capture handled exception and send it to Sentry.
        const eventId = Sentry.captureException(extractedError);
        
        // When in development mode, log the error to console for immediate feedback.
        //if (!environment.production) {
        //    console.error(extractedError);
        //}
        //console.error(extractedError);
        
        // Optionally show user dialog to provide details on what happened.
        //Sentry.showReportDialog({ eventId });
        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        //throw error;
    }
    

    /*

    constructor(private injector: Injector) { }


    handleError(error) {
        // your custom error handling logic
        
        //both clientside and serverside errors have a message property that we can show to the user.


        const loggingService = this.injector.get(LoggingService);
        const location = this.injector.get(LocationStrategy);
        const message = error.message ? error.message : error.toString();
        const url = location instanceof PathLocationStrategy? location.path() : '';

        // get the stack trace, lets grab the last 10 stacks only
        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
                .splice(0, 20)
                .map(function(sf) {
                    return sf.toString();
                }).join('\n');

            // log on the server
            loggingService.log({ message, url, stack: stackString });
        });

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;

    }
    */
}