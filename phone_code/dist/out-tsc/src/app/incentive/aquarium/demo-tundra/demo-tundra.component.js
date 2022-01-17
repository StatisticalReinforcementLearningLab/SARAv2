import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TundraLevel1 } from './Tundra1';
import { Platform } from '@ionic/angular';
var DemoTundraComponent = /** @class */ (function () {
    function DemoTundraComponent(platform, router) {
        this.platform = platform;
        this.router = router;
        console.log("Constructor called");
        //this.game.destroy();
    }
    DemoTundraComponent.prototype.ngOnInit = function () {
        //
        this.loadFunction();
    };
    DemoTundraComponent.prototype.loadFunction = function () {
        //height adjustment for different phone types
        var GameApp = GameApp || {};
        GameApp.CANVAS_WIDTH = 382.0;
        console.log("w: " + window.innerWidth + ", h: " + window.innerHeight + ", dp: " + window.devicePixelRatio);
        if (window.innerWidth > GameApp.CANVAS_WIDTH)
            GameApp.CANVAS_WIDTH = window.innerWidth;
        GameApp.CANVAS_HEIGHT = window.innerHeight;
        //var game;
        if (this.platform.is('ios')) {
            if (GameApp.CANVAS_HEIGHT < 642.0) //iphone SE fix.
                GameApp.CANVAS_HEIGHT += 60;
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 21 * window.devicePixelRatio, Phaser.AUTO, 'gameDiv');
        }
        else if (this.platform.is('android'))
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 74, Phaser.AUTO, 'gameDiv');
        else
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 100, Phaser.AUTO, 'gameDiv');
        var tundraLevel1 = new TundraLevel1();
        this.game.state.add('Tundra1', tundraLevel1);
        this.game.state.start('Tundra1');
    };
    DemoTundraComponent.prototype.goToRewardsPage = function () {
        console.log("rewards page");
        this.router.navigate(['/home']);
    };
    DemoTundraComponent.prototype.ionViewDidLeaveFunction = function () {
        console.log("Tundra, ionDidLeave");
        this.game.destroy();
    };
    DemoTundraComponent = tslib_1.__decorate([
        Component({
            selector: 'app-demo-tundra',
            templateUrl: './demo-tundra.component.html',
            styleUrls: ['./demo-tundra.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Platform, Router])
    ], DemoTundraComponent);
    return DemoTundraComponent;
}());
export { DemoTundraComponent };
//# sourceMappingURL=demo-tundra.component.js.map