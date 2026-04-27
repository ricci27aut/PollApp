import { Component } from '@angular/core';
import { StartSurveyButtonComponent } from '../component/start-survey-button-component/start-survey-button-component';
import { DropdownMenu } from '../component/dropdown-menu/dropdown-menu'

@Component({
  selector: 'app-start-screen',
  imports: [StartSurveyButtonComponent, DropdownMenu],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreen {}
