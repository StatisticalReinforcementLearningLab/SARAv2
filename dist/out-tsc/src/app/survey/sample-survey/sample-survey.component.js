import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
//import { PreLoad } from '../../PreLoad';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
var SampleSurveyComponent = /** @class */ (function () {
    function SampleSurveyComponent(ga) {
        this.ga = ga;
    }
    SampleSurveyComponent.prototype.ngOnInit = function () {
        this.ga.trackView('Survey')
            .then(function () { console.log("trackView at Survey!"); })
            .catch(function (e) { return console.log('Error starting GoogleAnalytics == ' + e); });
    };
    SampleSurveyComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sample-survey',
            templateUrl: './sample-survey.component.html',
            styleUrls: ['./sample-survey.component.scss'],
        })
        //@PreLoad('life-insights')
        ,
        tslib_1.__metadata("design:paramtypes", [GoogleAnalytics])
    ], SampleSurveyComponent);
    return SampleSurveyComponent;
}());
export { SampleSurveyComponent };
//# sourceMappingURL=sample-survey.component.js.map