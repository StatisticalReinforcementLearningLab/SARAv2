/* Installation:

ionic install @ionic-native/sqlite @ionic-native/sqlite-porter
ionic cordova plugin add cordova-sqlite-storage
ionic cordova plugin add uk.co.workingedge.cordova.plugin.sqliteporter

Follow reference: https://devdactic.com/ionic-4-sqlite-queries/
*/

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import { UserProfileService } from '../user/user-profile/user-profile.service';

export interface TrackObj {
  id: number,
  pageName: string,
  eventTime: Date,
  eventDate: string,
  unix_ts: number, 
  day_count: number,
  eventStatus: string,
  username: string
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  tracks = new BehaviorSubject([]);

  constructor(
    private plt: Platform, 
    private sqlitePorter: SQLitePorter, 
    private sqlite: SQLite, 
    private userProfileService: UserProfileService,
    private http: HttpClient) {  
       this.plt.ready().then(() => {
        this.sqlite.create({
          name: 'tracks.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
            this.database = db;
            //this.dropTable();
            //console.log("table deleted!");
            this.createDatabase();
        }); 
      });      
    }

    createDatabase() {
      console.log("start seedDatabase!");
      return this.http.get('assets/track.sql', { responseType: 'text' })
        .subscribe(sql => {
          this.sqlitePorter.importSqlToDb(this.database, sql)
            .then(_ => {
              console.log('Before displayTracks');
              this.displayTracks();
              console.log('Tracks displayed');
              this.dbReady.next(true);
            })
            .catch(e => console.error("In seedDatabase:" + e));
        });
    }    

    getDatabaseState() {
      return this.dbReady.asObservable();
    }
    
    getTracks(): Observable<any[]> {
      return this.tracks.asObservable();
    }    

    dropTable(){
      return this.database.executeSql('DROP TABLE IF EXISTS tracks').then(data => {
        console.log('Table deleted!');
      }).catch(e => {
        console.log("dropTable:"+JSON.stringify(e));
        //this.isTableExist();
      });      
    }

    emptyTable(){
      return this.database.executeSql('DELETE FROM tracks').then(data => {
        console.log('Table emptied!');
      }).catch(e => {
        console.log("deleteTable:"+JSON.stringify(e));
      });      
    }

    
    isTableExist() : Promise<any> {
      console.log("Inside isTableEmpty:");
      //return this.database.executeSql('SELECT * FROM tracks', []).then(data => {
      return this.database.executeSql("SELECT * FROM sqlite_master WHERE name ='tracks' and type='table'", []).then(data => {
        var rowlength = data.rows.length;
        console.log("isTableEmpty rowlength= "+rowlength);
        return rowlength != 0;
      }).catch(e => {
        console.log("At isTableNotEmpty:"+JSON.stringify(e));
        return false;
      });
    }

    isTableEmpty() : Promise<any> {
      console.log("Inside isTableEmpty:");
      return this.database.executeSql('SELECT * FROM tracks', []).then(data => {
         var rowlength = data.rows.length;
        console.log("isTableEmpty rowlength= "+rowlength);
        return rowlength == 0;
      }).catch(e => {
        console.log("At isTableNotEmpty:"+JSON.stringify(e));
        return true;
      });
    }

    saveAppUsageEnter2(pageName){
      this.getDatabaseState().subscribe(rdy => {
        if (rdy) { 
          var day_count = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;    
          this.addTrack(pageName, "Enter", this.userProfileService.username, day_count); 
        }
      }); 
    }

    saveAppUsageExit2(pageName){
      this.getDatabaseState().subscribe(rdy => {
        if (rdy) {  
          var day_count = Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length;    
          this.addTrack(pageName, "Exit", this.userProfileService.username, day_count); 
        }
      }); 
    }


    //save usage
    /*
    saveAppUsage(pageName, eventStatus, username, day_count){
      this.getDatabaseState().subscribe(rdy => {
        if (rdy) {     
          this.addTrack(pageName, eventStatus, username, day_count); 
        }
      }); 
    }
    */
      
    addTrack(pageName, eventStatus, username, day_count) {
      var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
      var currentDate = moment().format('YYYYMMDD');
      var unix_ts = new Date().getTime();
      let data = [pageName, currentTime, currentDate, unix_ts, day_count, eventStatus, username];
      return this.database.executeSql('INSERT INTO tracks (pageName, eventTime, eventDate, unix_ts, day_count, eventStatus, username) VALUES (?, ?, ?, ?, ?, ?, ?)', data).then(data => {
        console.log('App usage added!! ' + pageName + ", " + eventStatus);
        //this.displayTracks();
      }).catch(e => console.log("In addTrack:"+pageName+" "+JSON.stringify(e)));

    }   
    
    displayTracks() {
      //let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
      return this.database.executeSql('SELECT * FROM tracks', []).then(data => {
        let currentTracks: TrackObj[] = [];
        var rowlength = data.rows.length;
        console.log("data.rows= "+rowlength);
        if (rowlength > 0) {
          for (var i = 0; i < rowlength; i++) {
            console.log("data.rows= "+rowlength);
            console.log("displayTracks "+i+" pageName: "+ data.rows.item(i).pageName + ", eventTime " + data.rows.item(i).eventStatus);
            //console.log("displayTracks "+i+" time: "+data.rows.item(i).eventTime);
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
      }).catch(e => console.log("In displayTracks:"+e));
    }
    
    exportDatabaseToJson() : Promise<any> { 
      return this.sqlitePorter.exportDbToJson(this.database).then(res => {
        //console.log('Exported '+JSON.stringify(res));
        return res;
      }).catch(e => console.error(e));

    }

}