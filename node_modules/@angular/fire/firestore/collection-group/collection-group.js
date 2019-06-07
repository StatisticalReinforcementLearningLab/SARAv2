import { from } from 'rxjs';
import { fromCollectionRef } from '../observable/fromRef';
import { map, filter, scan } from 'rxjs/operators';
import { validateEventsArray } from '../collection/collection';
import { docChanges, sortedChanges } from '../collection/changes';
import { runInZone } from '@angular/fire';
var AngularFirestoreCollectionGroup = (function () {
    function AngularFirestoreCollectionGroup(query, afs) {
        this.query = query;
        this.afs = afs;
    }
    AngularFirestoreCollectionGroup.prototype.stateChanges = function (events) {
        if (!events || events.length === 0) {
            return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)));
        }
        return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)))
            .pipe(map(function (actions) { return actions.filter(function (change) { return events.indexOf(change.type) > -1; }); }), filter(function (changes) { return changes.length > 0; }));
    };
    AngularFirestoreCollectionGroup.prototype.auditTrail = function (events) {
        return this.stateChanges(events).pipe(scan(function (current, action) { return current.concat(action); }, []));
    };
    AngularFirestoreCollectionGroup.prototype.snapshotChanges = function (events) {
        var validatedEvents = validateEventsArray(events);
        var sortedChanges$ = sortedChanges(this.query, validatedEvents);
        var scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
    };
    AngularFirestoreCollectionGroup.prototype.valueChanges = function () {
        var fromCollectionRef$ = fromCollectionRef(this.query);
        var scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
            .pipe(map(function (actions) { return actions.payload.docs.map(function (a) { return a.data(); }); }));
    };
    AngularFirestoreCollectionGroup.prototype.get = function (options) {
        return from(this.query.get(options)).pipe(runInZone(this.afs.scheduler.zone));
    };
    return AngularFirestoreCollectionGroup;
}());
export { AngularFirestoreCollectionGroup };
//# sourceMappingURL=collection-group.js.map