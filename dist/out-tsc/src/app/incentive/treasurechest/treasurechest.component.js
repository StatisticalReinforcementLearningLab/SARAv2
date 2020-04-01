import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
var TreasurechestComponent = /** @class */ (function () {
    function TreasurechestComponent() {
        this.amount_earned = "$0";
        this.pearlsAndGems = [];
        this.pointsdata = [];
    }
    TreasurechestComponent.prototype.ngOnInit = function () {
        var _this = this;
        //load reward data
        var badges;
        //badges = JSON.parse(window.localStorage['badges'] || "{}");
        var user_data = JSON.parse(window.localStorage['user_data'] || "{}");
        badges = user_data['badges'] || {};
        if ('money' in badges) { //means things are empty.
        }
        else {
            badges['daily_survey'] = [0, 0, 0, 0, 0, 0];
            badges['weekly_survey'] = [0, 0, 0, 0];
            badges['active_tasks'] = [0, 0, 0, 0, 0, 0];
            badges['money'] = 10;
        }
        //add the money
        this.amount_earned = "$" + badges['money'];
        //
        if (window.localStorage['AwardDollar'] == undefined)
            this.amount_earned = "$" + 0;
        else
            this.amount_earned = "$" + parseInt(window.localStorage['AwardDollar']);
        //add the badges for daily survey
        var daily_survey_tasks = [2, 1, 0, 3, 1, 1]; //badges['daily_survey'];
        //daily_survey_tasks = [3,2,0,2,2,1]; 
        //daily_survey_tasks = [0,0,0,0,0];
        //badges['weekly_survey'] = [0,0,0,0];
        var daily_width = [50, 30, 42, 30, 42, 40, 46];
        var ds_tasks_badges = ['img/backgroud_daily.png', 'img/green.png', 'img/blue.png', 'img/red.png', 'img/bronze.png', 'img/silver.png', 'img/gold.png'];
        for (var i = 1; i < ds_tasks_badges.length; i++) {
            if (daily_survey_tasks[i - 1] > 0) {
                for (var q = 0; q < daily_survey_tasks[i - 1]; q++)
                    this.pearlsAndGems.push({ "img": "assets/" + ds_tasks_badges[i], "count": daily_survey_tasks[i - 1], "width": daily_width[i] * 3 / 2 });
            }
        }
        fetch('../../../assets/game/fishpoints.json').then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data, current_points, survey_string, isNextAvailableStillMasked, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1:
                        data = _a.sent();
                        current_points = 700;
                        survey_string = "";
                        isNextAvailableStillMasked = false;
                        for (i = 0; i < data.length; i++) {
                            data[i].class = 'nonshade';
                            data[i].img = "assets/" + data[i].img.substring(0, data[i].img.length - 4) + '_tn.jpg';
                            data[i].fish_index = i;
                            data[i].show_trivia = 1;
                            /*
                            if(current_points < data[i].points){
                              if(isNextAvailableStillMasked == false){
                                 //
                                 data[i].img = data[i].img.substring(0, data[i].img.length-7) + '-grey_tn.jpg';
                                 isNextAvailableStillMasked = true;
                                 //data[i].class = 'shade';
                              }
                              else{
                                data[i].img = 'assets/img/cryptocoin_tn.jpg';
                              }
                  
                              data[i].show_trivia = 0;
                            }
                  
                            if(data[i].name === 'Sea environment'){
                              data[i].show_trivia = 0;
                            }
                            */
                        }
                        this.pointsdata = data;
                        return [2 /*return*/];
                }
            });
        }); });
        //add the fish to be unlocked
    };
    TreasurechestComponent.prototype.sum = function (arr) {
        var total = 0;
        for (var i in arr) {
            total += arr[i];
        }
        return total;
    };
    TreasurechestComponent = tslib_1.__decorate([
        Component({
            selector: 'app-treasurechest',
            templateUrl: './treasurechest.component.html',
            styleUrls: ['./treasurechest.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], TreasurechestComponent);
    return TreasurechestComponent;
}());
export { TreasurechestComponent };
//# sourceMappingURL=treasurechest.component.js.map