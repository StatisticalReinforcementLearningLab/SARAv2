import { AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { SwiperComponent } from "swiper/element";
// import Swiper core and required modules
// import SwiperCore, { Pagination } from "swiper";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// install Swiper modules
// SwiperCore.use([Pagination]);

@Component({
    selector: 'app-sam-tutorial',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [CommonModule],
    templateUrl: './sam-tutorial.component.html',
    styleUrls: ['./sam-tutorial.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SamTutorialComponent implements OnInit {


    slides = [{
            "text": "Welcome! My name is SAM. What’s yours?",
            "font": "24px"
        },
        {
            "text": "Hi [name]! Let me tell you a bit about why you’re here.",
            "font": "24px"
        },
        {
            "text": "I live in Cabot House. I love it here in my little aquarium, but I do wish I could see my students more.",
            "font": "20px"
        },
        {
            "text": "They never seem to be in the room, and they only appear to rest for a short time. Sometimes I see them pulling all-nighters just to get their work done. </br></br> I’m a bit worried about them.",
            "font": "18px"
        },
        {
            "text": "I’ve talked with some of the other elder fish, and they said that Harvard students are super busy. They often prioritize everything else above sleep, leaving them feeling exhausted and burnt out. </br></br> It seems that many of the students at Harvard could use more rest.",
            "font": "18px"
        },
        {
            "text": "So, I contacted some Harvard psychology and computer science researchers to learn more. </br></br> They told me that losing sleep to get work done is a lose-lose because it drains motivation and can lead to burn out.",
            "font": "18px"
        },
        {
            "text": "Together, we created this app to help Harvard students improve the amount and quality of sleep they get. </br></br> This can help supercharge your health, wellbeing, and motivation.",
            "font": "18px"
        },
        {
            "text": "Now, I see that YOU are a Harvard student too! If you’re interested in improving your sleep, I’d love to hear more about you! </br></br> Click the link below to tell the researchers and I some basic info about yourself.",
            "font": "18px"
        }];

    pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    };

    constructor(private router: Router) { }
    ngAfterContentChecked() {
        // if (this.swiper) {
        //     this.swiper.updateSwiper({});
        // }
    }

    onSwiper([swiper]) {
        console.log(swiper);
    }

    ngOnInit() {}

    onSlideChange() {
        console.log('slide change');
    }

    closeTutorial(){
        this.router.navigate(['home']);
    }
}
