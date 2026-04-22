import { Component } from '@angular/core';
import { StartSurveyButtonComponent } from '../component/start-survey-button-component/start-survey-button-component';

@Component({
  selector: 'app-start-screen',
  imports: [StartSurveyButtonComponent],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreen {}
