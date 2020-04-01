import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
//import { VisualizationComponent } from './visualization/visualization.component';
//import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';
//import { SurveyModule } from '../survey/survey.module';
import { RouterModule } from '@angular/router';
import { AwardComponent } from './award/award.component';
import { TreasurechestComponent } from './treasurechest/treasurechest.component';
import { AwardAltruismComponent } from './award-altruism/award-altruism.component';
import { ModalUnlockedPageComponent } from './aquarium/modal-unlocked-page/modal-unlocked-page.component';
var routes = [
    //  { path: 'award', component: AwardComponent },
    { path: 'award-memes', component: AwardMemesComponent },
];
var IncentiveModule = /** @class */ (function () {
    function IncentiveModule() {
    }
    IncentiveModule = tslib_1.__decorate([
        NgModule({
            declarations: [AwardComponent, AwardMemesComponent, AwardAltruismComponent, TreasurechestComponent, ModalUnlockedPageComponent],
            imports: [
                CommonModule,
                IonicModule.forRoot(),
                RouterModule.forChild(routes)
            ],
            exports: [
                //AwardComponent, 
                AwardMemesComponent,
                AwardAltruismComponent
                //VisualizationComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            entryComponents: [ModalUnlockedPageComponent]
        })
    ], IncentiveModule);
    return IncentiveModule;
}());
export { IncentiveModule };
//# sourceMappingURL=incentive.module.js.map