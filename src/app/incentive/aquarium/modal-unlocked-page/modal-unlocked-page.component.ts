import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-unlocked-page',
  templateUrl: './modal-unlocked-page.component.html',
  styleUrls: ['./modal-unlocked-page.component.scss'],
})
export class ModalUnlockedPageComponent implements OnInit {

  // Data passed in by componentProps
  @Input() currentPoints: number;
  @Input() previousPoints: number;
  @Input() awardedDollar: number;
  reinforcements;

  constructor(navParams: NavParams, public modalCtrl: ModalController) {
    // componentProps can also be accessed at construction time using NavParams
    console.log(navParams.get('firstName'));
    this.reinforcements = [];//[{'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"}];
  }

  ngOnInit() {

    //get if money is awarded.
    if(this.awardedDollar > 0)
      this.reinforcements.push({'img': 'assets/img/1dollar.jpg', 'header': 'Earned ' + this.awardedDollar + ' dollar(s)', 'text': 'You earned 1 dollar for completing surveys 3-days in a row'});

    //get if fish is alotted

    var current_point = this.currentPoints;
    var previous_point = current_point - 100;

    //
    //this.reinforcements.push({'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 
    //      'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"});

    
    //

    fetch('../../../assets/game/fishpoints.json').then(async res => {
      //console.log("Fishes: " + data);

      var fish_data = await res.json();
      var img; 
      var header;
      var text;
      for(var i = 0; i < fish_data.length; i++) {
          if ((fish_data[i].points > previous_point) && (fish_data[i].points <= current_point)) {
            img = "assets/" + fish_data[i].img.substring(0, fish_data[i].img.length-4) + '_tn.jpg';
            header =  fish_data[i].name + " unlocked";
            text = fish_data[i].trivia;
            this.reinforcements.push({'img': img, 'header': header, 'text': text});
          }
      }
    });


  }

 
  dismiss() {

    //pass-data: https://ionicframework.com/docs/v3/api/components/modal/ModalController/
    //let data = { 'foo': 'bar' };
    //this.modalCtrl.dismiss(data);
    this.modalCtrl.dismiss();

  }

}
