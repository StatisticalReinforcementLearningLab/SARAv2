import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { publish, refCount } from 'rxjs/operators';


@Injectable()
export class NotificationService {

  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().pipe(
    publish(),
    refCount()
  )

  constructor() {}

  notify(message) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }

}