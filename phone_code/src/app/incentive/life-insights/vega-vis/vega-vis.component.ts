import { Component, OnInit } from '@angular/core';
import embed from 'vega-embed';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { ComputeServiceService } from '../compute-service/compute-service.service';
import * as $ from "jquery";

@Component({
    selector: 'app-vega-vis',
    templateUrl: './vega-vis.component.html',
    styleUrls: ['./vega-vis.component.scss'],
})
export class VegaVisComponent implements OnInit {

    constructor(public httpClient: HttpClient,
        private ComputeServ: ComputeServiceService) { 
    }

    ngOnInit() {
    }

    ionViewDidEnter() {
        var cards = $(".gallerycard");
        for(var i = 0; i < cards.length; i++){
            var target = Math.floor(Math.random() * cards.length -1) + 1;
            var target2 = Math.floor(Math.random() * cards.length -1) +1;
            cards.eq(target).before(cards.eq(target2));
        }

        var dateArray = this.getDatesForLast7days();
        let sevenDaySurveyDataFromatted = this.ComputeServ.getSurveyData(); //This will save the new data
        //this.loadVegaDemoPlotSleep(dateArray);
        this.loadVegaDemoPlotMotivation(dateArray);
        this.loadVegaDemoPlotPositive(dateArray);
        this.loadVegaMultiGraphPlotPositive(dateArray);
        //this.loadVegaDemoPlotSleepBarGraph();
    }

    getDatesForLast7days(){
        var dateArray = [];
        for (let i = 0; i < 6; i++) {
            var previousdate = moment().subtract(6-i, "days").format("MM/DD");
            dateArray.push(previousdate);
        }
        dateArray.push("Today");
        //console.log("=== date array ===: " + date_array);
        return dateArray;
    }
    

    async loadVegaDemoPlotMotivation(dateArray) {

        let sevenDaySurveyDataFromatted = JSON.parse(window.localStorage['sevenDaySurveyDataFromatted']);
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 305);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        if (y < 300) {
            //this means the width is lower than 300. The canvas will be skewed.
            y = y + 200;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y,
            height: 200
        };

        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_motivation.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");

                res["encoding"]["y"]["scale"] = {"domain": [-0.5, 4.5]};

                for(let i=0; i<7; i++){
                    res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["Date"] = dateArray[i];
                    //motivation
                    res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["Motivation"] = sevenDaySurveyDataFromatted['motivation']['data'][i];
                }
                //console.log(res);
                const result = await embed('#vis4', res, opt);
                console.log(result.view);
            });
    }


    async loadVegaDemoPlotPositive(dateArray) {

        let sevenDaySurveyDataFromatted = JSON.parse(window.localStorage['sevenDaySurveyDataFromatted']);
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 305);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        if (y < 300) {
            //this means the width is lower than 300. The canvas will be skewed.
            y = y + 200;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y,
            height: 200
        };

        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_bar.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");

                res["encoding"]["y"]["field"] = "Positive";
                res["encoding"]["y"]["scale"] = {"domain": [0.0, 4.5]};

                for(let i=0; i<7; i++){
                    res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Date"] = dateArray[i];
                    //motivation
                    let x = sevenDaySurveyDataFromatted['positive']['data'][i];
                    if(x == null)
                        res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0;
                    else if(x == 0)
                        res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0.1;
                    else
                        res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = x;
                }
                // res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][0]["Positive"] = undefined;
                //console.log(res);
                const result = await embed('#vis5', res, opt);
                console.log(result.view);
            });
    }

    async loadVegaMultiGraphPlotPositive(dateArray) {

        let sevenDaySurveyDataFromatted = JSON.parse(window.localStorage['sevenDaySurveyDataFromatted']);
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 305);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        if (y < 300) {
            //this means the width is lower than 300. The canvas will be skewed.
            y = y + 200;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y,
            height: 200
        };

        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_multigraph.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");

                // res["encoding"]["y"]["field"] = "Positive";
                res["encoding"]["y"]["scale"] = {"domain": [-0.5, 4.5]};

                //
                let dataTypes = ["pain", "fatigue", "nausea", "lonely"];
                var j = 0;
                res["datasets"]["data-b0fe595546d47c5085f225c35730172c"] = [];
                for(let j=0; j< dataTypes.length; j++){
                    for(let i=0+7*j; i<7+7*j; i++){
                        // res["datasets"]["data-b0fe595546d47c5085f225c35730172c"][i]["Date"] = dateArray[i-7*j];
                        // res["datasets"]["data-b0fe595546d47c5085f225c35730172c"][i]["symbol"] = dataTypes[j];
                        // res["datasets"]["data-b0fe595546d47c5085f225c35730172c"][i]["value"] = sevenDaySurveyDataFromatted[dataTypes[j]]['data'][i-7*j];
                        if(sevenDaySurveyDataFromatted[dataTypes[j]]['data'][i-7*j] != null)
                            sevenDaySurveyDataFromatted[dataTypes[j]]['data'][i-7*j] = sevenDaySurveyDataFromatted[dataTypes[j]]['data'][i-7*j] + 0;

                        res["datasets"]["data-b0fe595546d47c5085f225c35730172c"].push({
                            "Date": dateArray[i-7*j],
                            "symbol": dataTypes[j],
                            "value": sevenDaySurveyDataFromatted[dataTypes[j]]['data'][i-7*j],
                        });

                        //motivation
                        // let x = sevenDaySurveyDataFromatted['positive']['data'][i];
                        // if(x == null)
                        //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0;
                        // else if(x == 0)
                        //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0.1;
                        // else
                        //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = x;
                    }
                }

                //
                // for(let i=7; i<14; i++){
                //     res["datasets"]["data-b0fe595546d47c5085f225c35730172c"][i]["Date"] = dateArray[i-7];
                //     //motivation
                //     // let x = sevenDaySurveyDataFromatted['positive']['data'][i];
                //     // if(x == null)
                //     //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0;
                //     // else if(x == 0)
                //     //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = 0.1;
                //     // else
                //     //     res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Positive"] = x;
                // }

                //

                // res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][0]["Positive"] = undefined;
                //console.log(res);
                const result = await embed('#vis6', res, opt);
                console.log(result.view);
            });
    }




    //======================================================================
    //
    //
    async loadVegaDemoPlotSleep(dateArray) {

        //may be have to do pixel 
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 300);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        if (y < 300) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y,
            height: 200
        };
        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_sleep.json";
        //const result = await embed('#vis1', spec, opt);
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");
                for(let i=0; i<7; i++)
                    res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["Date"] = dateArray[i];
                //console.log(res);
                const result = await embed('#vis1', res, opt);
                console.log(result.view);
            });
        //console.log(result.view);
    }

    async loadVegaDemoPlotSleepBarGraph() {
        let x = window.innerWidth;
        let y = Math.ceil((24 / 20) * (x - 390) + 305);
        if (y < 200) {
            //this means the height is higher. The canvas will be skewed.
            y = y + 20;
        }
        if (y < 300) {
            //this means the width is lower than 300. The canvas will be skewed.
            y = y + 20;
        }
        console.log("width:x " + x);
        console.log("width:y " + y);
        console.log("window.devicePixelRatio " + window.devicePixelRatio);

        var opt = {
            actions: false,
            width: y,
            height: 200
        };

        console.log("===Vega called 2===");
        const spec = "/assets/vegaspecs/demo_sleep_bar_graph.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");
                //res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][0]["date"] = "1/15";
                //console.log(res);
                const result = await embed('#vis3', res, opt);
                console.log(result.view);
            });
    }

}
