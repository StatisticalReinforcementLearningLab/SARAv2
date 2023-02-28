import { Component, OnInit } from '@angular/core';
import embed from 'vega-embed';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vega-vis',
  templateUrl: './vega-vis.component.html',
  styleUrls: ['./vega-vis.component.scss'],
})
export class VegaVisComponent implements OnInit {

  constructor(public httpClient: HttpClient) { }

  ngOnInit() {
    this.loadVegaDemoPlotSleep();
    this.loadVegaDemoPlotMotivation();
  }

  async loadVegaDemoPlotSleep() {

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
    const result = await embed('#vis1', spec, opt);
    console.log(result.view);
  }

  async loadVegaDemoPlotMotivation() {
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
        res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][0]["date"] = "1/15";
        //console.log(res);
        const result = await embed('#vis2', res, opt);
        console.log(result.view);
      });
  }

}
