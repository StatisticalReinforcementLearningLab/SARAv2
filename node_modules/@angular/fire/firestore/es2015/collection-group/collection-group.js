import { from } from 'rxjs';
import { fromCollectionRef } from '../observable/fromRef';
import { map, filter, scan } from 'rxjs/operators';
import { validateEventsArray } from '../collection/collection';
import { docChanges, sortedChanges } from '../collection/changes';
import { runInZone } from '@angular/fire';
export class AngularFirestoreCollectionGroup {
    constructor(query, afs) {
        this.query = query;
        this.afs = afs;
    }
    stateChanges(events) {
        if (!events || events.length === 0) {
            return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)));
        }
        return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)))
            .pipe(map(actions => actions.filter(change => events.indexOf(change.type) > -1)), filter(changes => changes.length > 0));
    }
    auditTrail(events) {
        return this.stateChanges(events).pipe(scan((current, action) => [...current, ...action], []));
    }
    snapshotChanges(events) {
        const validatedEvents = validateEventsArray(events);
        const sortedChanges$ = sortedChanges(this.query, validatedEvents);
        const scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
    }
    valueChanges() {
        const fromCollectionRef$ = fromCollectionRef(this.query);
        const scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
            .pipe(map(actions => actions.payload.docs.map(a => a.data())));
    }
    get(options) {
        return from(this.query.get(options)).pipe(runInZone(this.afs.scheduler.zone));
    }
}
//# sourceMappingURL=collection-group.js.map