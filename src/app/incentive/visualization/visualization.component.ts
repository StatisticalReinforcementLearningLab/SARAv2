import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent implements OnInit {
  title = 'D3 Linechart with Ionic 4';
  width: number;
  height: number;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  x: any;
  y: any;
  svg: any;
  line: d3Shape.Line<[number, number]>;
  sin: any[]; 
  sin2: any [];
  cos: any [];

  constructor() { 
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

  }

  ngOnInit() {
     //Data is represented as an array of {x,y} pairs.
     this.sin = [];
     this.sin2 = [];    
     this.cos = [];
     for (var i = 0; i < 100; i++) {
       this.sin.push({x: i, y: Math.sin(i/10)});
       this.sin2.push({x: i, y: Math.sin(i/10) *0.25 + 0.5});
       this.cos.push({x: i, y: .5 * Math.cos(i/10)});
     }
     this.initSvg();
     this.initAxis();
     this.drawAxis();
     this.drawLines();   
  }

  initSvg() {
    this.svg = d3.select('#lineChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 900 500')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.sin, (d) => d.x ));
    this.y.domain(d3Array.extent(this.sin, (d) => d.y ));
  }

  drawAxis() {
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  }

  drawLines(){
    this.line = d3Shape.line()
      .x( (d: any) => this.x(d.x) )
      .y( (d: any) => this.y(d.y) );

    this.svg.append('path')
      .datum(this.sin)
      .attr('class', 'line')
      .attr('d', this.line)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2);

    /*this.svg.append('path')
      .datum(this.sin2)
      .attr('class', 'line')
      .attr('d', this.line)
      .style("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", 2);
 
    this.svg.append('path')
      .datum(this.cos)
      .attr('class', 'line')
      .attr('d', this.line)
      .style("fill", "none")
      .style("stroke", "green")
      .style("stroke-width", 2); */

  }

}
