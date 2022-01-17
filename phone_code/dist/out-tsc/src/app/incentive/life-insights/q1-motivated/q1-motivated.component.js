import * as tslib_1 from "tslib";
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
var Q1MotivatedComponent = /** @class */ (function () {
    function Q1MotivatedComponent() {
    }
    Object.defineProperty(Q1MotivatedComponent.prototype, "jsonObj", {
        get: function () {
            // transform value for display
            return this._jsonObj;
        },
        set: function (jsonObj) {
            console.log('prev _jsonObj: ', this._jsonObj);
            console.log('got jsonObj: ', jsonObj);
            this._jsonObj = jsonObj;
        },
        enumerable: true,
        configurable: true
    });
    Q1MotivatedComponent.prototype.ngOnInit = function () {
        //console.log(this.inputStr);
        //this.jsonObj = JSON.parse(this.inputStr);
        console.log("Q1MotivatedComponent " + JSON.stringify(this._jsonObj));
        this.imgloc = this._jsonObj.imgloc;
        this.title = this._jsonObj.title;
        this.subtext = this._jsonObj.subtext;
        this.topSubtext = this._jsonObj.topSubtext;
        this.bottomSubtext = this._jsonObj.bottomSubtext;
        this.question = this._jsonObj.question;
        this.data = this._jsonObj.data;
        this.labels = this._jsonObj.labels;
        this.qYaxis = this._jsonObj.qYaxis;
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
    tslib_1.__decorate([
        ViewChild('lineCanvas', { static: true }),
        tslib_1.__metadata("design:type", ElementRef)
    ], Q1MotivatedComponent.prototype, "lineCanvas", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], Q1MotivatedComponent.prototype, "jsonObj", null);
    Q1MotivatedComponent = tslib_1.__decorate([
        Component({
            selector: 'app-q1-motivated',
            templateUrl: './q1-motivated.component.html',
            styleUrls: ['./q1-motivated.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], Q1MotivatedComponent);
    return Q1MotivatedComponent;
}());
export { Q1MotivatedComponent };
//# sourceMappingURL=q1-motivated.component.js.map