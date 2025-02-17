import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SimpleLoadingStrategy } from './SimpleLoadingStrategy';
import { AwardMemesComponent } from './incentive/award-memes/award-memes.component';
import { DemoAquariumComponent } from './incentive/aquarium/demo-aquarium/demo-aquarium.component';
//import { SelectiveLoadingStrategy } from './SelectiveLoadingStrategy';
//import { InitiatedDrinkComponent } from './survey/initiated-drink/initiated-drink.component';
//import { AwardComponent } from './incentive/award/award.component';
//import { ActivetaskComponent } from './survey/activetask/activetask.component';
//import { ActiveTask2Component } from './survey/active-task2/active-task2.component';
//import { VisualizationComponent } from './incentive/visualization/visualization.component';
//import { DynamicSurveyComponent } from './survey/dynamic-survey/dynamic-survey.component';
//import { Q1MotivatedComponent } from './incentive/life-insights/q1-motivated/q1-motivated.component';
//import { SampleSurveyComponent } from './survey/sample-survey/sample-survey.component';
import { SampleLifeInsightsComponent } from './incentive/life-insights/sample-life-insights/sample-life-insights.component';
import { TreasurechestComponent } from './incentive/treasurechest/treasurechest.component';
import { SampleSurveyComponent } from './survey/sample-survey/sample-survey.component';
import { AwardAltruismComponent } from './incentive/award-altruism/award-altruism.component';
import { CheatpageComponent } from './incentive/aquarium/cheatpage/cheatpage.component';
import { AyaSampleSurveyComponent } from './survey/aya-sample-survey/aya-sample-survey.component';
import { AuthGuard } from './user/auth/auth.guard';
import { AuthComponent } from './user/auth/auth.component';
import { InfoPageComponent } from './incentive/info-page/info-page.component';
import { ContactComponent } from './home/contact/contact.component';
import { FishbowlComponent } from './incentive/aquarium/previews/fishbowl/fishbowl.component';
import { SeaComponent } from './incentive/aquarium/previews/sea/sea.component';
import { TundraComponent } from './incentive/aquarium/previews/tundra/tundra.component';
import { RainforestComponent } from './incentive/aquarium/previews/rainforest/rainforest.component';
//import { HarvardSurveyComponent } from './survey/harvard-survey/harvard-survey.component';
import { FrontPageComponent } from './intervention/harvard-arc-apps/front-page/front-page.component';
import { VideoInfoPageComponent } from './incentive/video-info-page/video-info-page.component';
import { SamplePythonViewComponent } from './incentive/life-insights/sample-python-view/sample-python-view.component';
import { SleepSurveyComponent } from './survey/sleep-survey/sleep-survey.component';
import { DogsSurveyComponent } from './survey/dogs-survey/dogs-survey.component';
import { SleepMonitoringComponent } from './intervention/sleep-monitoring/sleep-monitoring.component';
import { SleepStudyEveningSurveyComponent } from './survey/sleep-study-evening-survey/sleep-study-evening-survey.component';
import { SleepSurveyWithPredictionComponent } from './survey/sleep-survey-with-prediction/sleep-survey-with-prediction.component';
import { MedicationCalendarComponent } from './intervention/medication-calendar/medication-calendar.component';
import { SamTutorialComponent } from './baseline/sam-tutorial/sam-tutorial.component';
import { VegaVisComponent } from './incentive/life-insights/vega-vis/vega-vis.component';
import { TailoredMessagesComponent } from './intervention/tailored-messages/tailored-messages.component';
import { TailoredMessageSingleComponent } from './intervention/tailored-message-single/tailored-message-single.component';
import { BaselineSurveyComponent } from './survey/baseline-survey/baseline-survey.component';


const routes: Routes = [
  
  /*   
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'survey/initated-drink', component: InitiatedDrinkComponent },
  { path: 'survey/activetask', component: ActivetaskComponent },
  { path: 'survey/activetask2', component: ActiveTask2Component },
  { path: 'survey/dynamicsurvey', component: DynamicSurveyComponent }, 
  { path: 'survey/samplesurvey', component: SampleSurveyComponent }, 
  { path: 'incentive/award', component: AwardComponent },
  { path: 'incentive/award-memes', component: AwardMemesComponent },
  { path: 'incentive/visualization', component: VisualizationComponent},
  { path: 'incentive/aquariumone', component: DemoAquariumComponent },  
  { path: 'life-insight/q1lifeinsight', component: Q1MotivatedComponent },
  */
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'auth', component: AuthComponent}, 
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]},
  //{ path: 'home', component: DemoAquariumComponent, canActivate: [AuthGuard]},
  { path: 'incentive/sample-life-insight', component: SampleLifeInsightsComponent, canActivate: [AuthGuard]},
  { path: 'incentive/treasurechest', component: TreasurechestComponent, canActivate: [AuthGuard]},
  { path: 'incentive/cheatpoints', component: CheatpageComponent, canActivate: [AuthGuard]},
  { path: 'survey/samplesurvey', component: SampleSurveyComponent, canActivate: [AuthGuard]}, 
  { path: 'survey/samplesurvey2', component: AyaSampleSurveyComponent, canActivate: [AuthGuard]}, 
  //{ path: 'survey/harvardsurvey', component: HarvardSurveyComponent, canActivate: [AuthGuard]}, 
  { path: 'survey/sleepsurvey', component: SleepSurveyComponent, canActivate: [AuthGuard]},
  { path: 'survey/sleepeveningsurvey', component: SleepStudyEveningSurveyComponent, canActivate: [AuthGuard]},
  { path: 'survey/sleepsurveywithprediction', component: SleepSurveyWithPredictionComponent, canActivate: [AuthGuard]},
  { path: 'survey/dogssurvey', component: DogsSurveyComponent, canActivate: [AuthGuard]},
  { path: 'survey/baselinesurvey', component: BaselineSurveyComponent, canActivate: [AuthGuard]},
  { path: 'intervention/arcappsfrontpage', component: FrontPageComponent, canActivate: [AuthGuard]}, 
  { path: 'incentive/aquariumone', component: DemoAquariumComponent, canActivate: [AuthGuard]},
  { path: 'incentive/award-memes', component: AwardMemesComponent, canActivate: [AuthGuard]},
  { path: 'incentive/award-altruism', component: AwardAltruismComponent, canActivate: [AuthGuard]},
  { path: 'incentive/pythonlifeinsightsammple', component: SamplePythonViewComponent, canActivate: [AuthGuard]},
  { path: 'incentive/vegalifeinsight', component: VegaVisComponent, canActivate: [AuthGuard]},
  { path: 'contact-study-staff', component: ContactComponent, canActivate: [AuthGuard]},
  { path: 'incentive/infopage', component: InfoPageComponent, canActivate: [AuthGuard]},
  { path: 'incentive/videoinfopage', component: VideoInfoPageComponent, canActivate: [AuthGuard]},
  { path: 'preview/fishbowl', component: FishbowlComponent, canActivate: [AuthGuard]},
  { path: 'preview/sea', component: SeaComponent, canActivate: [AuthGuard]},
  { path: 'preview/tundra', component: TundraComponent, canActivate: [AuthGuard]},
  { path: 'intervention/sleep-monitoring', component: SleepMonitoringComponent, canActivate: [AuthGuard]},
  //{ path: 'intervention/medication-calendar', component: MedicationCalendarComponent, canActivate: [AuthGuard]},
  { path: 'intervention/medication-calendar', component: MedicationCalendarComponent},
  { path: 'preview/rainforest', component: RainforestComponent, canActivate: [AuthGuard]},
  { path: 'baseline/tutorial', component: SamTutorialComponent, canActivate: [AuthGuard]},
  { path: 'intervention/tailored-message', component: TailoredMessagesComponent, canActivate: [AuthGuard]},
  { path: 'intervention/tailored-message-single', component: TailoredMessageSingleComponent, canActivate: [AuthGuard]},
  {
    path: 'add-event-modal',
    loadChildren: () => import('./intervention/medication-calendar/add-event-modal/add-event-modal.module').then( m => m.AddEventModalPageModule)
  },
  {
    path: 'add-medication',
    loadChildren: () => import('./intervention/medication-calendar/add-medication/add-medication.module').then( m => m.AddMedicationPageModule)
  }

  //{ path: 'incentive/award-memes', component: AwardMemesComponent },
  //{ path: 'incentive/aquariumone', component: DemoAquariumComponent },  
  /*
  { 
    path: 'survey', 
    //loadChildren: () => import('./survey/survey.module').then(mod => mod.SurveyModule)
    loadChildren: './survey/survey.module#SurveyModule',
    data: {
      //name: 'survey'
      preload: false
    }
  }, 
  */
  /*
  { 
    path: 'incentive/aquarium', 
       loadChildren: './incentive/aquarium/aquarium.module#AquariumModule',
       data: {
        //name: 'survey'
        preload: true
      }    
  }, 
  */
   /*
  { 
    path: 'incentive', 
      loadChildren: './incentive/incentive.module#IncentiveModule',
     data: {
       //name: 'survey'
       preload: true
     }    
  }
  */

  // { path: 'incentive/life-insights', 
  //   loadChildren: './incentive/life-insights/life-insights.module#LifeInsightsModule',
  //   data: {
  //     //name: 'life-insights'
  //     preload: true
  //   } 
  // }, 


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})

/*
@NgModule({
  providers: [
    SimpleLoadingStrategy
    //SelectiveLoadingStrategy
  ],
  imports: [
    //RouterModule.forRoot(routes)
    RouterModule.forRoot(routes, { preloadingStrategy: SimpleLoadingStrategy })
  ],
  exports: [RouterModule]
})
*/
export class AppRoutingModule { }
