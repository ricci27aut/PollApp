import { Routes } from '@angular/router';
import { StartScreen } from './startscreeen/start-screen'
import { CreateSurveyComponent } from './component/create-survey-component/create-survey-component';
import { SurveyVoting } from './component/survey-voting/survey-voting';

export const routes: Routes = [
    {
        path: "",
        component: StartScreen
    },

    {
        path: "create-survey",
        component: CreateSurveyComponent
    },

    {
        path: ':id/:title/voting',
        component: SurveyVoting
    }
];
