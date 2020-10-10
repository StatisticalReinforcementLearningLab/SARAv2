import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { LifeInsightsProfileService } from "../life-insights-profile.service";



@Component({
	selector: 'app-show-all-life-insights',
	templateUrl: './show-all-life-insights.component.html',
	styleUrls: ['./show-all-life-insights.component.css']
})
export class ShowAllLifeInsightsComponent implements OnInit {


	//convert that into a for loop.
	@ViewChild('lineCanvas', { static: true }) lineCanvas: ElementRef<HTMLDivElement>;
	@ViewChild('lineCanvas2', { static: true }) lineCanvas2: ElementRef<HTMLDivElement>;

	imgloc;
	title;
	subtext;
	bottomSubtext;
	topSubtext;
	question;
	data;
	options;
	labels;
	qYaxis;

	imgloc2;
	title2;
	subtext2;
	bottomSubtext2;
	topSubtext2;
	question2;
	options2;
	labels2;
	qYaxis2;
	selectedValue2;


	qYaxisArray;
	index = 0;
	selectedValue;


	private lineChart: Chart;
	questionType: any;

	constructor(private lifeInsightsProfileService: LifeInsightsProfileService) {
		//--- 

	}

	/*   
	  
	  get jsonObj(): any {
		// transform value for display
		return this._jsonObj;
	  }
	  
	  @Input()
	  set jsonObj(jsonObj: any) {
		console.log('prev _jsonObj: ', this._jsonObj);
		console.log('got jsonObj: ', jsonObj);
		this._jsonObj = jsonObj;
	  } 
  
	*/

	ngOnInit() {

		//

		/*getObservableFromFetch returns a Observable*/
		let observable = this.lifeInsightsProfileService.
			importLifeInsightProfileUsingObservable('/assets/data/json.json')

		/*Subscribe to trigger the fetch call*/
		observable.subscribe(v => {
			//console.log(v);

			this.drawLifeInsight(0, this.lineCanvas);

			//
			this.drawLifeInsight(1, this.lineCanvas2);
		});



	}

	drawLifeInsight(index: number, lineCanvas) {

		/* 
		 * 
		 * Example life-insight. 
		 *
		 *

			var lifeInsightProfile = {
				"questions":["Q3d","Q4d","Q5d","Q8d"],
				"qimgs": ["assets/img/stress.png","assets/img/freetime.png","assets/img/dance2.png","assets/img/social.png"],
				"lifeInsightsTitle": ["How much <b>pain</b> are you currently experiencing?", 
					"How much <b>fatigue</b> are you currently experiencing?", 
					"How much <b>nausea</b> are you currently experiencing?", 
					"How <b>motivated</b> are you to take 6MP today?"],
				"qYaxis": ["Pain level","Fatigue level","Nausea level","Degree of motivation"],
				"qSubText": ["0 = low pain, 4 = severe pain", 
						"0 = low fatigue, 4 = severe fatigue",
						"0 = low nausea, 4 = severe nausea",
						"0 = less motivated, 4 = highly motivated"],
				"lifeInsightsHighStress": [
					"Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
					"Fatigued <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
					"Nausea <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>",
					"Motivated <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>"],
				"lifeInsightsLowStress": [
					"Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>",  
					"Fatigued <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
					"Nausea <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
					"Motivated <i class='em em-sunglasses'></i><i class='em em-boat'></i>"]         
			};

		*/

		//reading all the values from life-insight.
		this.index = index; //Math.floor(Math.random() * this.lifeInsightsProfileService.lifeInsightProfile.questions.length);
		var questionType;
		if(index == 0){
			this.question = this.lifeInsightsProfileService.lifeInsightProfile.questions[this.index];
			this.imgloc = this.lifeInsightsProfileService.lifeInsightProfile.qimgs[this.index];
			this.title = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsTitle[this.index];
			this.qYaxis = this.lifeInsightsProfileService.lifeInsightProfile.qYaxis[this.index];
			this.subtext = this.lifeInsightsProfileService.lifeInsightProfile.qSubText[this.index];
			this.topSubtext = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsHighStress[this.index];
			this.bottomSubtext = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsLowStress[this.index];
			this.selectedValue = this.lifeInsightsProfileService.lifeInsightProfile.qYaxis[this.index];
			questionType = this.lifeInsightsProfileService.lifeInsightProfile.questionType[this.index];
		}

		var questionType2;
		if(index == 1){
			this.question = this.lifeInsightsProfileService.lifeInsightProfile.questions[this.index];
			this.imgloc2 = this.lifeInsightsProfileService.lifeInsightProfile.qimgs[this.index];
			this.title2 = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsTitle[this.index];
			this.qYaxis = this.lifeInsightsProfileService.lifeInsightProfile.qYaxis[this.index];
			this.subtext2 = this.lifeInsightsProfileService.lifeInsightProfile.qSubText[this.index];
			this.topSubtext2 = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsHighStress[this.index];
			this.bottomSubtext2 = this.lifeInsightsProfileService.lifeInsightProfile.lifeInsightsLowStress[this.index];
			this.selectedValue2 = this.lifeInsightsProfileService.lifeInsightProfile.qYaxis[this.index];
			questionType2 = this.lifeInsightsProfileService.lifeInsightProfile.questionType[this.index];
		}
		

		//read data from localStorage 
		if (window.localStorage.getItem("lifeInsight") == undefined) {
			console.log("Undefined!");
			this.data = [0, 1, 3, 4, null, 3, 1];
			//this.inputString = JSON.stringify(this.inputJson);
		}
		else {

			//
			var lifeInsightObj = JSON.parse(window.localStorage.getItem("lifeInsight"));
			//console.log(JSON.stringify(lifeInsightObj));

			//
			this.data = [];
			this.labels = [];
			for (var i = 6; i >= 0; i--) {
				var currentdate = moment().subtract(i, "days").format("DD-MM-YYYY");
				//console.log("Inside loop: currentdate: "+currentdate);
				if (i == 0) {
					this.labels.push("Today");
				} else {
					this.labels.push(moment().subtract(i, "days").format("MM/DD"));
				}
				//console.log("Local Storage save: "+question+" "+JSON.stringify(lifeInsightObj[question]));
				var dates = lifeInsightObj[this.question]["dates"];
				var dateIndex = dates.lastIndexOf(currentdate);
				if (dateIndex > -1) {
					//
					if(questionType == "horizontal_radiobutton")
						this.data.push(parseInt(lifeInsightObj[this.question]['data'][dateIndex]));

					this.data.push(lifeInsightObj[this.question]['data'][dateIndex]);
				}
				else {
					this.data.push(null);
				}
			}
			//this.data = [null, null, null, null, null, null, 1];
			//console.log("Data, " + this.data);

		}

		//this.data = [0, 1, 3, 4, null, 3, 1];
		if(index == 1)
			this.data = [0, 1, 3, 4, null, 3, 1];

		if(index == 0)
			this.data = [3, 3, 4, 3, 3, 3, 2];

		var numberOfLevels = 5;
		this.drawLineChartRadioButton(this.data, numberOfLevels, lineCanvas, this.qYaxis);

		//

	}


	drawLineChartRadioButton(data: any, numberOfLevels, lineCanvas, qYaxis) {
		this.lineChart = new Chart(lineCanvas.nativeElement, {
			type: "line",
			data: {
				labels: this.labels,  //["9/13", "9/14", "9/15", "9/16", "9/17", "9/18", "Today"], //x-label
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
						data: data, //y-label
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
							labelString: qYaxis,
							fontColor: "#000"
						},
						ticks: {
							max: numberOfLevels - 1,
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
	}

}
