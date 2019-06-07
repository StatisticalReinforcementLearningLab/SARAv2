import { NgZone, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseOptions, FirebaseAppConfig } from '@angular/fire';
import { FirebaseFunctions, FirebaseZoneScheduler } from '@angular/fire';
export declare const FunctionsRegionToken: InjectionToken<string>;
export declare const FUNCTIONS_ORIGIN: InjectionToken<string>;
export declare const FUNCTIONS_REGION: InjectionToken<string>;
export declare class AngularFireFunctions {
    readonly functions: FirebaseFunctions;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, platformId: Object, zone: NgZone, region: string | null, origin: string | null);
    httpsCallable<T = any, R = any>(name: string): (data: T) => Observable<R>;
}
