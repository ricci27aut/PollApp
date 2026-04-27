import { Routes } from '@angular/router';
import { StartScreen } from './startscreeen/start-screen'
import { CreateSurveyComponent } from './component/create-survey-component/create-survey-component';
import { DropdownMenu } from './component/dropdown-menu/dropdown-menu';

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
