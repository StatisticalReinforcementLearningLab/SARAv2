import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReinforestLevel1 } from './ReinforestLevel1';
var DemoReinforestComponent = /** @class */ (function () {
    function DemoReinforestComponent(router) {
        this.router = router;
        console.log("Constructor called");
        this.game = new Phaser.Game(window.innerWidth, 515, Phaser.AUTO, 'gameDiv');
        this.game.state.add('ReinforestLevel1', ReinforestLevel1);
        this.game.state.start('ReinforestLevel1');
        //self = this;
        //this.game.state.states["GameSmall"].assignscope(this);
        //this.game = new Phaser.Game(1000, 515, Phaser.CANVAS, 'phaser-example', { preload: this.preload, create: this.create }); 
    }
    DemoReinforestComponent.prototype.ionViewDidLeave = function () {
        this.game.destroy();
    };
    DemoReinforestComponent.prototype.goToRewardsPage = function () {
        console.log("rewards page");
        this.router.navigate(['/home']);
    };
    DemoReinforestComponent.prototype.ngOnInit = function () { };
    DemoReinforestComponent = tslib_1.__decorate([
        Component({
            selector: 'app-demo-reinforest',
            templateUrl: './demo-reinforest.component.html',
            styleUrls: ['./demo-reinforest.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [Router])
    ], DemoReinforestComponent);
    return DemoReinforestComponent;
}());
export { DemoReinforestComponent };
//# sourceMappingURL=demo-reinforest.component.js.map