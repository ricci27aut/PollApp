import { Component, OnInit } from '@angular/core';
import { SurveyParticipation } from '../survey-participation/survey-participation'
import { StartSurveyButtonComponent } from '../start-survey-button-component/start-survey-button-component'

@Component({
  selector: 'app-survey-voting',
  imports: [SurveyParticipation, StartSurveyButtonComponent],
  templateUrl: './survey-voting.html',
  styleUrl: './survey-voting.scss',
})
export class SurveyVoting {}
