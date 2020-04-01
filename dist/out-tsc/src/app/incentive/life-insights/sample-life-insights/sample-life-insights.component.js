import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
//import * as lifeInsightProfile from "../../../../assets/data/life_insight.json";
//import { PreLoad } from '../../../PreLoad';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
var SampleLifeInsightsComponent = /** @class */ (function () {
    function SampleLifeInsightsComponent(ga) {
        this.ga = ga;
        this.index = 0;
    }
    /*   get jsonObj(): any {
        // transform value for display
        return this._jsonObj;
      }
      
      @Input()
      set jsonObj(jsonObj: any) {
        console.log('prev _jsonObj: ', this._jsonObj);
        console.log('got jsonObj: ', jsonObj);
        this._jsonObj = jsonObj;
      } */
    SampleLifeInsightsComponent.prototype.ngOnInit = function () {
        this.ga.trackView('Life-insight')
            .then(function () { console.log("trackView at Life-insight!"); })
            .catch(function (e) { return console.log(e); });
        this.init(this.index);
    };
    SampleLifeInsightsComponent.prototype.init = function (index) {
        //console.log(this.inputStr);
        //this.jsonObj = JSON.parse(this.inputStr);
        var lifeInsightProfile = {
            "questions": ["Q3d", "Q4d", "Q5d", "Q8d"],
            "qimgs": ["assets/img/stress.png", "assets/img/freetime.png", "assets/img/dance2.png", "assets/img/social.png"],
            "lifeInsightsTitle": ["How much <b>pain</b> are you currently experiencing?",
                "How much <b>fatigue</b> are you currently experiencing?",
                "How much <b>nausea</b> are you currently experiencing?",
                "How <b>motivated</b> are you to take 6MP today?"],
            "qYaxis": ["Pain level", "Fatigue level", "Nausea level", "Degree of motivation"],
            "qSubText": ["0 = low pain, 4 = severe pain",
                "0 = low fatigue, 4 = severe fatigue",
                "0 = low nausea, 4 = severe nausea",
                "0 = less motivated, 4 = highly motivated"],
            "lifeInsightsHighStress": [
                "Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                "Fatigued <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                "Nausea <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
                "Motivated <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>"
            ],
            "lifeInsightsLowStress": [
                "Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                "Fatigued <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                "Nausea <i class='em em-sunglasses'></i><i class='em em-boat'></i>",
                "Motivated <i class='em em-sunglasses'></i><i class='em em-boat'></i>"
            ]
        };
        this.index = Math.floor(Math.random() * lifeInsightProfile.questions.length);
        this.question = lifeInsightProfile.questions[this.index];
        this.imgloc = lifeInsightProfile.qimgs[this.index];
        this.title = lifeInsightProfile.lifeInsightsTitle[this.index];
        this.qYaxis = lifeInsightProfile.qYaxis[this.index];
        this.subtext = lifeInsightProfile.qSubText[this.index];
        this.topSubtext = lifeInsightProfile.lifeInsightsHighStress[this.index];
        this.bottomSubtext = lifeInsightProfile.lifeInsightsLowStress[this.index];
        this.qYaxisArray = lifeInsightProfile.qYaxis;
        this.selectedValue = lifeInsightProfile.qYaxis[this.index];
        //read data from localStorage 
        if (window.localStorage.getItem("lifeInsight") == undefined) {
            console.log("Undefined!");
            this.data = [0, 1, 3, 4, null, 3, 1];
            //this.inputString = JSON.stringify(this.inputJson);
        }
        else {
            var lifeInsightObj = JSON.parse(window.localStorage.getItem("lifeInsight"));
            console.log(JSON.stringify(lifeInsightObj));
            this.data = [];
            this.labels = [];
            for (var i = 6; i >= 0; i--) {
                var currentdate = moment().subtract(i, "days").format("DD-MM-YYYY");
                //console.log("Inside loop: currentdate: "+currentdate);
                if (i == 0) {
                    this.labels.push("Today");
                }
                else {
                    this.labels.push(moment().subtract(i, "days").format("MM/DD"));
                }
                //console.log("Local Storage save: "+question+" "+JSON.stringify(lifeInsightObj[question]));
                var dates = lifeInsightObj[this.question]["dates"];
                var dateIndex = dates.lastIndexOf(currentdate);
                if (dateIndex > -1) {
                    this.data.push(lifeInsightObj[this.question]['data'][dateIndex]);
                }
                else {
                    this.data.push(null);
                }
            }
            //this.data = [null, null, null, null, null, null, 1];
            console.log("Data, " + this.data);
        }
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: "line",
            data: {
                labels: this.labels,
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "rgba(75,192,192,1)",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 4,
                        pointHitRadius: 10,
                        data: this.data,
                        spanGaps: false
                    }
                ]
            },
            options: {
                tooltips: { enabled: false },
                hover: { mode: null },
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 5,
                        right: 5,
                        top: 15,
                        bottom: 5
                    }
                },
                scales: {
                    yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: this.qYaxis,
                                fontColor: "#000"
                            },
                            ticks: {
                                max: 4,
                                min: 0,
                                stepSize: 1,
                                display: true
                            }
                        }],
                    xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Day',
                                fontColor: "#000"
                            }
                        }],
                }
            }
        });
    };
    SampleLifeInsightsComponent.prototype.ratingChanged = function (rating) {
        if (rating == 0)
            console.log("thumbs down");
        else
            console.log("thumbs up");
        //this.router.navigate(['incentive/aquarium/aquariumone']);
        //this.router.navigate(['/home']);
        window.location.href = '/home';
    };
    tslib_1.__decorate([
        ViewChild('lineCanvas', { static: true }),
        tslib_1.__metadata("design:type", ElementRef)
    ], SampleLifeInsightsComponent.prototype, "lineCanvas", void 0);
    SampleLifeInsightsComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sample-life-insights',
            templateUrl: './sample-life-insights.component.html',
            styleUrls: ['./sample-life-insights.component.scss'],
        })
        //@PreLoad('q1lifeinsight')
        ,
        tslib_1.__metadata("design:paramtypes", [GoogleAnalytics])
    ], SampleLifeInsightsComponent);
    return SampleLifeInsightsComponent;
}());
export { SampleLifeInsightsComponent };
//# sourceMappingURL=sample-life-insights.component.js.map