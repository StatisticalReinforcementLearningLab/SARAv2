//contains the two classes UserProfile and UserProfileFixed

export class UserProfile {
    public badges=  { 'daily_survey': [],
                     'money': 0,
                     };
    public daily_streak ={};
    public imei:string = "0";
    public dollars: number = 0 ;

    public life_insights = {"daily_survey": {}};
    public reinfrocement_data = {};

    public oneSignalPlayerId?: string;     
    public AwardDollarDates?: {};                

    public lastupdate: number;
    public readable_ts: string;
    public survey_data = {
        'daily_survey':{}, 
        'points': 0,
        'weekly_survey':{}
    };

    
    public username: string;
    public versionNumber: string;
    public datesTaken: string[];
    public points: number;
    public badgeCount: number;
    public firstlogin: any;

    // created constructor to initialize UserProfile - early on
    constructor(username: string, 
                datesTaken: string[], 
                points: number,
                badgeCount: number,
                lastupdate: number,
                readable_ts: string){        
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