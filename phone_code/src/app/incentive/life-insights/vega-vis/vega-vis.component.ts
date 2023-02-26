import { Component, OnInit } from '@angular/core';
import embed from 'vega-embed';


@Component({
  selector: 'app-vega-vis',
  templateUrl: './vega-vis.component.html',
  styleUrls: ['./vega-vis.component.scss'],
})
export class VegaVisComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.loadVegaDemoPlotSleep();
    this.loadVegaDemoPlotMotivation();
  }

  async loadVegaDemoPlotSleep() {
    console.log("===Vega called 2===");
    const spec = "/assets/vegaspecs/demo_sleep.json";
    const result = await embed('#vis1', spec);
    console.log(result.view);
  }

  async loadVegaDemoPlotMotivation() {
    console.log("===Vega called 2===");
    const spec = "/assets/vegaspecs/demo_motivation.json";
    const result = await embed('#vis2', spec);
    console.log(result.view);
  }

}
