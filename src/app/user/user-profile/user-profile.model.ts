export class UserProfile {
    public badges=  { 'daily_survey': [],
                     'money': 0,
                     };
    public daily_streak ={};
    public imei:string = "0";
    // had change below replacing - with _
    public life_insights = {"daily_survey": {}};
    public reinfrocement_data = {};

    public oneSignalPlayerId?: string;                     

    public lastupdate: number;
    public readable_ts: string;
    public survey_data = {
        'daily_survey':{}, 
        'points': 0,
        'weekly_survey':{}
    };
    public username: string;
    public isParent?: boolean;
    public isActive: boolean;
    public datesTaken: string[];
    public points: number;
    public badgeCount: number;
    //access token
    //refresh token 

    constructor(username: string, 
                isParent: boolean, 
                datesTaken: string[], 
                points: number,
                badgeCount: number,
                lastupdate: number,
                readable_ts: string){        
        // this.userID = userID;
        this.isParent = isParent;
        this.username = username;
        this.datesTaken = datesTaken;
        this.points = points;
        this.badgeCount = badgeCount;
        this.lastupdate = lastupdate;
        this.readable_ts = readable_ts;
    }
}
    
export class UserProfileFixed {
    public isActive?: boolean;                     
    public isParent?: boolean;
}