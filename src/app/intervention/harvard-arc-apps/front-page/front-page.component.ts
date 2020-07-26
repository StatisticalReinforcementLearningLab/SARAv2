import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

export interface ArcApp {
    name: string;
    url: string;
}

export interface ArcAppWithImageAndDescriptions {
    name: string;
    url: string;
    img: string;
    description: string;
}

@Component({
    selector: 'app-front-page',
    templateUrl: './front-page.component.html',
    styleUrls: ['./front-page.component.css']
})

export class FrontPageComponent implements OnInit {

    TM_apps_thumbs: ArcAppWithImageAndDescriptions[] = [
        {
            name: "Tomato Timer",
            url: "https://tomato-timer.com/",
            img: "./assets/img/arcapps/tomatoapp.png",
            description: "Tomato timer chunks larger-works into a set of intervals separated by short breaks."
        },
        {
            name: "Forest",
            url: "https://www.forestapp.cc/",
            img: "./assets/img/arcapps/forestapp.png",
            description: "Forest is an app that helps you stay focused on the important things in life."
        }
    ];

    TM_apps: ArcApp[] = [
        { name: "Tomato Timer", url: "https://tomato-timer.com/" },
        { name: "Forest", url: "https://www.forestapp.cc/" },
        { name: "Focus", url: "https://heyfocus.com/" },
        { name: "mystudylife", url: "https://tomato-timer.com/" },
        { name: "weekplan", url: "https://tomato-timer.com/" },
        { name: "Pomodoro Technique", url: "https://tomato-timer.com/" },
    ];

    Internet_Blocking_Tools: ArcApp[] = [
        { name: "SelfControlapp", url: "https://selfcontrolapp.com/" },
        { name: "Freedom", url: "https://tomato-timer.com/" },
        { name: "Stayfocusd", url: "https://tomato-timer.com/" },
        { name: "getcoldturckey", url: "https://tomato-timer.com/" },
    ];

    Task_Management: ArcApp[] = [
        { name: "Asana: Organize Tasks and Work", url: "https://selfcontrolapp.com/" },
        { name: "Trello", url: "https://tomato-timer.com/" },
        { name: "Wunderlist", url: "https://tomato-timer.com/" },
        { name: "Google Calendar", url: "https://tomato-timer.com/" },
        { name: "Toodledo", url: "https://tomato-timer.com/" },
    ];

    constructor(private router: Router,
        public navController: NavController,
        private menuCtrl: MenuController) { }

    ngOnInit() {
        this.menuCtrl.close();
    }

    goHome() {
        this.navController.navigateRoot(['home']);
    }

    //"window.open('http://example.com/login/{{user._id}}', '_system', 'location=yes'); return false;"
    visitTheURL(url){
        console.log("visitTheURL");
        window.open(url, '_system', 'location=yes'); 
        return false;
    }
}
