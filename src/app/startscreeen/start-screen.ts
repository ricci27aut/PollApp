import { Component } from '@angular/core';
import { StartSurveyButtonComponent } from '../component/start-survey-button-component/start-survey-button-component';
import { DropdownMenu } from '../component/dropdown-menu/dropdown-menu'
import { EndingSurvey } from '../component/ending-survey/ending-survey'
import { SurveyOverview } from '../component/survey-overview/survey-overview';

@Component({
  selector: 'app-start-screen',
  imports: [StartSurveyButtonComponent, DropdownMenu, EndingSurvey, SurveyOverview],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreen {

  showPastSurveys = false;
}
