import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { AwsS3Service } from 'src/app/storage/aws-s3.service';
var AwardAltruismComponent = /** @class */ (function () {
    function AwardAltruismComponent(ga, route, userProfileService, awsS3Service, router) {
        var _this = this;
        this.ga = ga;
        this.route = route;
        this.userProfileService = userProfileService;
        this.awsS3Service = awsS3Service;
        this.router = router;
        this.reinforcementObj = {};
        this.reinforcement_data = {};
        this.HeartsBackground = {
            heartHeight: 60,
            heartWidth: 64,
            hearts: [],
            imageNames: ['valentinesheart.png', 'blueflower.png', 'yellowrose.png', 'redflower.png', 'yellowflower.png'],
            heartImage: './assets/img/',
            //heartImage: './assets/img/petal.png',
            maxHearts: 60,
            minScale: 0.4,
            draw: function () {
                //this.setCanvasSize();
                this.ctx.clearRect(0, 0, this.w, this.h);
                //console.log("Hearts draw function called");
                var ctx = this.ctx;
                for (var i = 0; i < this.hearts.length; i++) {
                    var heart = this.hearts[i];
                    heart.image = new Image();
                    heart.image.style.height = heart.height;
                    heart.image.src = this.heartImage;
                    ctx.drawImage(heart.image, heart.x, heart.y, heart.width, heart.height);
                }
                this.move();
            },
            move: function () {
                //console.log("Move function called");
                for (var b = 0; b < this.hearts.length; b++) {
                    var heart = this.hearts[b];
                    heart.y += heart.ys;
                    if (heart.y > this.h) {
                        //heart.x = Math.random() * this.w;
                        //heart.y = -1 * this.heartHeight;
                    }
                }
            },
            angularDraw: function () {
                //this.setCanvasSize();
                this.ctx.clearRect(0, 0, this.w, this.h);
                //console.log("Hearts draw function called");
                var ctx = this.ctx;
                for (var i = 0; i < this.hearts.length; i++) {
                    var heart = this.hearts[i];
                    /*
                    heart.image = new Image();
                    heart.image.style.height = heart.height;
                    heart.image.src = this.heartImage;
                    */
                    ctx.drawImage(heart.image, heart.angle_x, heart.angle_y, heart.width, heart.height);
                }
                this.angularMove();
            },
            angularMove: function () {
                //console.log("Move function called");
                for (var b = 0; b < this.hearts.length; b++) {
                    var heart = this.hearts[b];
                    //heart.y += heart.ys;
                    //console.log("" + heart.angle_x + "," + heart.angle_y);
                    //console.log(heart.angle);
                    //console.log("" + heart.angle_x + "," + heart.angle_y + ", " + heart.angle_deltax + ", " + heart.angle_deltay);
                    heart.angle_x += heart.angle_deltax;
                    heart.angle_y += heart.angle_deltay;
                    //console.log("" + heart.angle_x + "," + heart.angle_y);
                    if (heart.y > this.h) {
                        //heart.x = Math.random() * this.w;
                        //heart.y = -1 * this.heartHeight;
                    }
                }
            },
            setCanvasSize: function () {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight - 170;
                console.log("Set canvas size function called");
                this.w = this.canvas.width;
                this.h = this.canvas.height;
            },
            initialize: function () {
                var _this = this;
                console.log("Initialize hearts");
                this.canvas = document.getElementById("hearts_canvas"); //$('#canvas')[0]; hearts_canvas
                if (!this.canvas.getContext)
                    return;
                this.setCanvasSize();
                this.ctx = this.canvas.getContext('2d');
                this.canvas.addEventListener("touchstart", function (event) { event.preventDefault(); });
                this.canvas.addEventListener("touchmove", function (event) { event.preventDefault(); });
                this.canvas.addEventListener("touchend", function (event) { event.preventDefault(); });
                this.canvas.addEventListener("touchcancel", function (event) { event.preventDefault(); });
                // Attach an event handler to the document
                //this.canvas.addEventListener("mousemove",   function(event) {event.preventDefault()});
                for (var a = 0; a < this.maxHearts; a++) {
                    var scale = (Math.random() * (1 - this.minScale)) + this.minScale;
                    this.hearts.push({
                        x: Math.random() * this.w,
                        y: Math.random() * this.h,
                        ys: Math.random() + 8,
                        height: scale * this.heartHeight,
                        width: scale * this.heartWidth,
                        angle_x: this.w / 2,
                        angle_y: this.h / 2,
                        angle_deltax: this.getRandomArbitraryMoreThanX(-10, 10, 6),
                        angle_deltay: this.getRandomArbitraryMoreThanX(-10, 10, 6),
                        opacity: scale
                    });
                }
                //setInterval($.proxy(this.draw, this), 30);
                //setTimeout(e => this.draw, 30);
                //this.draw();
                var intervalVar;
                if (Math.random() > 0.5) {
                    //intervalVar = setInterval(e => this.angularDraw(), 30);
                    this.heartImage = this.heartImage + 'valentinesheart.png';
                }
                else {
                    //intervalVar = setInterval(e => this.draw(), 30);
                    //choose an heart image everytime
                    var randomElement = this.imageNames[Math.floor(Math.random() * this.imageNames.length)];
                    this.heartImage = this.heartImage + randomElement;
                }
                var image = new Image();
                image.src = this.heartImage;
                var hearts = this.hearts;
                var self_this = this;
                image.onload = function () {
                    for (var a = 0; a < hearts.length; a++) {
                        hearts[a].image = image;
                        hearts[a].image.style.height = hearts[a].height;
                    }
                    intervalVar = setInterval(function (e) { return self_this.angularDraw(); }, 30);
                };
                setTimeout(function (e) { return _this.stopInterval(intervalVar); }, 1200);
            },
            stopInterval: function (intervalVar) {
                this.ctx.clearRect(0, 0, this.w, this.h);
                clearInterval(intervalVar);
            },
            getRandomArbitrary: function (min, max) {
                return Math.random() * (max - min) + min;
            },
            getRandomArbitraryMoreThanX: function (min, max, X) {
                var rand_var = this.getRandomArbitrary(min, max);
                if (Math.abs(rand_var) < X) {
                    if (rand_var < X)
                        return rand_var - X;
                    if (rand_var > X)
                        return rand_var + X;
                }
                else {
                    return rand_var;
                }
            }
        };
        this.reinforcementObj['ds'] = 1;
        this.reinforcementObj['reward'] = 2;
        this.reinforcementObj['reward_type'] = 'altruistic message';
        this.route.queryParams.subscribe(function (params) {
            if (_this.router.getCurrentNavigation().extras.state) {
                _this.date = _this.router.getCurrentNavigation().extras.state.date;
                _this.reinforcementObj['prob'] = _this.router.getCurrentNavigation().extras.state.prob;
                _this.reinforcement_data = _this.router.getCurrentNavigation().extras.state.reinforcement_data;
                console.log("Inside AwardAltruism, date is: " + _this.date + " prob is: " + _this.reinforcementObj['prob']);
            }
        });
    }
    AwardAltruismComponent.prototype.ngOnInit = function () {
        this.ga.trackView('Award-altruism')
            .then(function () { console.log("trackView at award-altruism!"); })
            .catch(function (e) { return console.log(e); });
    };
    AwardAltruismComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        fetch('./assets/altruism/altruism_list.json').then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, res.json()];
                    case 1:
                        _a.altruism_data = _b.sent();
                        this.showaltruism();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AwardAltruismComponent.prototype.ionViewDidLeave = function () {
    };
    AwardAltruismComponent.prototype.showaltruism = function () {
        var _this = this;
        console.log('Altruism data: ' + JSON.stringify(this.altruism_data));
        this.altruism_data = this.shuffle(this.altruism_data);
        console.log('Altruism images suffled: ' + JSON.stringify(this.altruism_data));
        var picked_altruism_image = this.pick_altrusim(this.altruism_data);
        console.log('picked_altruism_image: ' + JSON.stringify(picked_altruism_image));
        this.whichImage = "./assets/altruism/" + picked_altruism_image[0]["filename"];
        this.reinforcementObj['reward_img_link'] = "/altruism/" + picked_altruism_image[0]["filename"];
        this.reinforcement_data['reward_img_link'] = "/altruism/" + picked_altruism_image[0]["filename"];
        setTimeout(function (e) { return _this.drawImageOnCanvas(_this.whichImage); }, 200);
    };
    AwardAltruismComponent.prototype.ratingChanged = function (rating) {
        if (rating == 0) {
            console.log("thumbs down");
            this.reinforcementObj['Like'] = "No";
            this.reinforcement_data['Like'] = "No";
            window.localStorage.setItem("Like", "No");
            this.awsS3Service.upload('reinforcement_data', this.reinforcement_data);
        }
        else {
            console.log("thumbs up");
            this.reinforcementObj['Like'] = "Yes";
            this.reinforcement_data['Like'] = "Yes";
            window.localStorage.setItem("Like", "Yes");
            this.awsS3Service.upload('reinforcement_data', this.reinforcement_data);
        }
        //this.userProfileService.addReinforcementData(this.date, this.reinforcementObj);    
        this.router.navigate(['home']);
    };
    /**
      * Shuffles array in place if it is not already shuffled
      * @param {Array} a items An array containing the items.
    */
    AwardAltruismComponent.prototype.shuffle = function (a) {
        if (window.localStorage['altruism_shuffle6'] == undefined) {
            //
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            //
            window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
            return a;
        }
        else {
            a = JSON.parse(window.localStorage['altruism_shuffle6']);
            return a;
        }
    };
    /**
     * Shuffles array in place if it is not already shuffled
     * @param {Array} a items An array containing the items.
    */
    AwardAltruismComponent.prototype.pick_altrusim = function (a) {
        var picked_altruism = a.splice(0, 1);
        a.push(picked_altruism[0]);
        window.localStorage['altruism_shuffle6'] = JSON.stringify(a);
        return picked_altruism;
    };
    AwardAltruismComponent.prototype.drawImageOnCanvas = function (imageF_file_path) {
        /*
        //
        var imageObj = new Image();
        imageObj.src = imageF_file_path;
        
        //
        var drawingCanvas = <HTMLCanvasElement>document.getElementById("drawing_canvas");
        drawingCanvas.style.width = '100%';
        drawingCanvas.width = drawingCanvas.offsetWidth;
       
        var ctx = drawingCanvas.getContext('2d');
       
        //
        imageObj.onload = function () {
          console.log("print: " + (imageObj.height/imageObj.width));
          drawingCanvas.height = Math.abs(drawingCanvas.width*(imageObj.height/imageObj.width));
    
          ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, // source rectangle
            0, 0, drawingCanvas.width, drawingCanvas.height); // destination rectangle
    
          //
          
        }
        */
        //this.HeartsBackground.initialize(drawingCanvas);
        this.HeartsBackground.initialize();
    };
    AwardAltruismComponent = tslib_1.__decorate([
        Component({
            selector: 'app-award-altruism',
            templateUrl: './award-altruism.component.html',
            styleUrls: ['./award-altruism.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [GoogleAnalytics,
            ActivatedRoute,
            UserProfileService,
            AwsS3Service,
            Router])
    ], AwardAltruismComponent);
    return AwardAltruismComponent;
}());
export { AwardAltruismComponent };
//# sourceMappingURL=award-altruism.component.js.map