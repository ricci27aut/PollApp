import { Routes } from '@angular/router';
import { StartScreen } from './startscreeen/start-screen'
import { CreateSurveyComponent } from './component/create-survey-component/create-survey-component';
import { SurveyOverview } from './component/survey-overview/survey-overview';

export const routes: Routes = [
    {
        path: "",
        component: StartScreen 
    },

    {
        path: "create-survey",
        component: CreateSurveyComponent
    }
];
