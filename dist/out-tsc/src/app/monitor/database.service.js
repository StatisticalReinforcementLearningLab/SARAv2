/* Installation:

ionic install @ionic-native/sqlite @ionic-native/sqlite-porter
ionic cordova plugin add cordova-sqlite-storage
ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqliteporter

Follow reference: https://devdactic.com/ionic-4-sqlite-queries/
*/
import * as tslib_1 from "tslib";
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
var DatabaseService = /** @class */ (function () {
    function DatabaseService(plt, sqlitePorter, sqlite, http) {
        var _this = this;
        this.plt = plt;
        this.sqlitePorter = sqlitePorter;
        this.sqlite = sqlite;
        this.http = http;
        this.dbReady = new BehaviorSubject(false);
        this.tracks = new BehaviorSubject([]);
        this.plt.ready().then(function () {
            _this.sqlite.create({
                name: 'tracks.db',
                location: 'default'
            }).then(function (db) {
                _this.database = db;
                //this.dropTable();
                //console.log("table deleted!");
                _this.createDatabase();
            });
        });
    }
    DatabaseService.prototype.createDatabase = function () {
        var _this = this;
        console.log("start seedDatabase!");
        return this.http.get('assets/track.sql', { responseType: 'text' })
            .subscribe(function (sql) {
            _this.sqlitePorter.importSqlToDb(_this.database, sql)
                .then(function (_) {
                console.log('Before displayTracks');
                _this.displayTracks();
                console.log('Tracks displayed');
                _this.dbReady.next(true);
            })
                .catch(function (e) { return console.error("In seedDatabase:" + e); });
        });
    };
    DatabaseService.prototype.getDatabaseState = function () {
        return this.dbReady.asObservable();
    };
    DatabaseService.prototype.getTracks = function () {
        return this.tracks.asObservable();
    };
    DatabaseService.prototype.dropTable = function () {
        return this.database.executeSql('DROP TABLE IF EXISTS tracks').then(function (data) {
            console.log('Table deleted!');
        }).catch(function (e) {
            console.log("dropTable:" + JSON.stringify(e));
            //this.isTableExist();
        });
    };
    DatabaseService.prototype.isTableExist = function () {
        console.log("Inside isTableEmpty:");
        //return this.database.executeSql('SELECT * FROM tracks', []).then(data => {
        return this.database.executeSql("SELECT * FROM sqlite_master WHERE name ='tracks' and type='table'", []).then(function (data) {
            var rowlength = data.rows.length;
            console.log("isTableEmpty rowlength= " + rowlength);
            return rowlength != 0;
        }).catch(function (e) {
            console.log("At isTableNotEmpty:" + JSON.stringify(e));
        });
    };
    DatabaseService.prototype.isTableEmpty = function () {
        console.log("Inside isTableEmpty:");
        return this.database.executeSql('SELECT * FROM tracks', []).then(function (data) {
            var rowlength = data.rows.length;
            console.log("isTableEmpty rowlength= " + rowlength);
            return rowlength == 0;
        }).catch(function (e) {
            console.log("At isTableNotEmpty:" + JSON.stringify(e));
        });
    };
    DatabaseService.prototype.addTrack = function (pageName, eventStatus, username, day_count) {
        var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
        var currentDate = moment().format('YYYYMMDD');
        var unix_ts = new Date().getTime();
        var data = [pageName, currentTime, currentDate, unix_ts, day_count, eventStatus, username];
        return this.database.executeSql('INSERT INTO tracks (pageName, eventTime, eventDate, unix_ts, day_count, eventStatus, username) VALUES (?, ?, ?, ?, ?, ?, ?)', data).then(function (data) {
            console.log(pageName + ' Track added!');
            //this.displayTracks();
        }).catch(function (e) { return console.log("In addTrack:" + pageName + " " + JSON.stringify(e)); });
    };
    DatabaseService.prototype.displayTracks = function () {
        //let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
        return this.database.executeSql('SELECT * FROM tracks', []).then(function (data) {
            var currentTracks = [];
            var rowlength = data.rows.length;
            console.log("data.rows= " + rowlength);
            if (rowlength > 0) {
                for (var i = 0; i < rowlength; i++) {
                    console.log("data.rows= " + rowlength);
                    console.log("displayTracks " + i + " pageName: " + data.rows.item(i).pageName);
                    console.log("displayTracks " + i + " time: " + data.rows.item(i).eventTime);
                    currentTracks.push({
                        id: data.rows.item(i).id,
                        pageName: data.rows.item(i).pageName,
                        eventTime: data.rows.item(i).eventTime,
                        eventDate: data.rows.item(i).eventDate,
                        unix_ts: data.rows.item(i).unix_ts,
                        day_count: data.rows.item(i).day_count,
                        eventStatus: data.rows.item(i).eventStatus,
                        username: data.rows.item(i).username,
                    });
                }
                //console.log("currentTracks length: "+currentTracks.length);
            }
            //this.tracks.next(currentTracks);  announce new value to all subscribers
        }).catch(function (e) { return console.log("In displayTracks:" + e); });
    };
    DatabaseService.prototype.exportDatabaseToJson = function () {
        return this.sqlitePorter.exportDbToJson(this.database).then(function (res) {
            console.log('Exported ' + JSON.stringify(res));
            return res;
        }).catch(function (e) { return console.error(e); });
    };
    DatabaseService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SQLitePorter,
            SQLite,
            HttpClient])
    ], DatabaseService);
    return DatabaseService;
}());
export { DatabaseService };
//# sourceMappingURL=database.service.js.map