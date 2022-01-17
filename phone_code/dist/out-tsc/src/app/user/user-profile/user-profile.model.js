//contains the two classes UserProfile and UserProfileFixed
var UserProfile = /** @class */ (function () {
    // created constructor to initialize UserProfile - early on
    function UserProfile(username, datesTaken, points, badgeCount, lastupdate, readable_ts) {
        this.badges = { 'daily_survey': [],
            'money': 0,
        };
        this.daily_streak = {};
        this.imei = "0";
        this.dollars = 0;
        this.life_insights = { "daily_survey": {} };
        this.reinfrocement_data = {};
        this.survey_data = {
            'daily_survey': {},
            'points': 0,
            'weekly_survey': {}
        };
        this.username = username;
        this.datesTaken = datesTaken;
        this.points = points;
        this.badgeCount = badgeCount;
        this.lastupdate = lastupdate;
        this.readable_ts = readable_ts;
    }
    return UserProfile;
}());
export { UserProfile };
var UserProfileFixed = /** @class */ (function () {
    function UserProfileFixed() {
    }
    return UserProfileFixed;
}());
export { UserProfileFixed };
//# sourceMappingURL=user-profile.model.js.map