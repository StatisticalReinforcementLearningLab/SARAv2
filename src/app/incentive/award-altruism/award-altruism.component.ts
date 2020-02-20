import { Component, OnInit } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-award-altruism',
  templateUrl: './award-altruism.component.html',
  styleUrls: ['./award-altruism.component.scss'],
})
export class AwardAltruismComponent implements OnInit {

  whichImage: string;
  altruism_data: any;
  date;
  prob;

  constructor(    
    private ga: GoogleAnalytics,
    private route: ActivatedRoute, 
    private router: Router) { 
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.date = this.router.getCurrentNavigation().extras.state.date;
          this.prob = this.router.getCurrentNavigation().extras.state.prob;
          console.log("Inside AwardAltruism, date is: " +this.date+" prob is: "+this.prob);
        }
      });      
    }

  ngOnInit() {
    this.ga.trackView('Award-altruism')
    .then(() => {console.log("trackView at award-altruism!")})
    .catch(e => console.log(e));



  }

  ngAfterViewInit() {
    fetch('./assets/altruism/altruism_list.json').then(async res => {
      this.altruism_data = await res.json();
      this.showaltruism();
    });

  }

  ionViewDidLeave(){

  }

  showaltruism(){
    console.log('Altruism data: ' + JSON.stringify(this.altruism_data));
    this.altruism_data = this.shuffle(this.altruism_data);
    console.log('Altruism images suffled: ' + JSON.stringify(this.altruism_data));
    var picked_altruism_image = this.pick_altrusim(this.altruism_data);
    console.log('picked_altruism_image: ' + JSON.stringify(picked_altruism_image));
    this.whichImage = "./assets/altruism/"+picked_altruism_image[0]["filename"];
  }
  
  ratingChanged(rating){
    if(rating==0) {
      console.log("thumbs down");
      window.localStorage.setItem("Like", "No");
    } else {
      console.log("thumbs up");
      window.localStorage.setItem("Like", "Yes");
    }

    
    window.location.href = '/home';
  }


  /**
    * Shuffles array in place if it is not already shuffled
    * @param {Array} a items An array containing the items.
  */
  shuffle(a) {

        if(window.localStorage['altruism_shuffle6'] == undefined){
          //
          var j: number, x: number, i: number;
          for (i = a.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * (i + 1));
              x = a[i];
              a[i] = a[j];
              a[j] = x;
          }
          //
          window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
          return a;
        }else{
          a  = JSON.parse(window.localStorage['altruism_shuffle6']);
          return a;
        }

    }

    /**
     * Shuffles array in place if it is not already shuffled
     * @param {Array} a items An array containing the items.
    */
    pick_altrusim(a) {
        var picked_altruism = a.splice(0,1);
        a.push(picked_altruism[0]);
        window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
        return picked_altruism;
    }

}
