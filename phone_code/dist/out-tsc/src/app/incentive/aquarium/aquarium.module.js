import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DemoAquariumComponent } from './demo-aquarium/demo-aquarium.component';
import { SurveyModule } from '../../survey/survey.module';
import { RouterModule } from '@angular/router';
import { AquariumComponent } from './aquarium.component';
var routes = [
    { path: 'aquariumone', component: DemoAquariumComponent }
];
var AquariumModule = /** @class */ (function () {
    function AquariumModule() {
    }
    AquariumModule = tslib_1.__decorate([
        NgModule({
            declarations: [DemoAquariumComponent, AquariumComponent],
            imports: [
                CommonModule,
                SurveyModule,
                IonicModule.forRoot(),
                RouterModule.forChild(routes)
            ],
            exports: [
                DemoAquariumComponent, AquariumComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
    ], AquariumModule);
    return AquariumModule;
}());
export { AquariumModule };
//# sourceMappingURL=aquarium.module.js.map