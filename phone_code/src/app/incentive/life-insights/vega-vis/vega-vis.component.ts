import { Component, OnInit } from '@angular/core';
import embed from 'vega-embed';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Component({
    selector: 'app-vega-vis',
    templateUrl: './vega-vis.component.html',
    styleUrls: ['./vega-vis.component.scss'],
})
export class VegaVisComponent implements OnInit {

    constructor(public httpClient: HttpClient) { }

    ngOnInit() {
        var dateArray = this.getDatesForLast7days();
        this.loadVegaDemoPlotSleep(dateArray);
        this.loadVegaDemoPlotMotivation(dateArray);
        this.loadVegaDemoPlotSleepBarGraph();
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
                    res["datasets"]["data-f5aa8050aacd2455481375b5a5ff3680"][i]["date"] = dateArray[i];
                //console.log(res);
                const result = await embed('#vis1', res, opt);
                console.log(result.view);
            });
        //console.log(result.view);
    }

    async loadVegaDemoPlotMotivation(dateArray) {
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
        const spec = "/assets/vegaspecs/demo_motivation.json";
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");
                for(let i=0; i<7; i++)
                    res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["date"] = dateArray[i];
                //console.log(res);
                const result = await embed('#vis2', res, opt);
                console.log(result.view);
            });
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
