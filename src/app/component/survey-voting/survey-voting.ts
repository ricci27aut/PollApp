import { Component, OnInit } from '@angular/core';
import { SurveyParticipation } from '../survey-participation/survey-participation'
import { StartSurveyButtonComponent } from '../start-survey-button-component/start-survey-button-component'
import { SurveyResults } from '../survey-results/survey-results'

@Component({
  selector: 'app-survey-voting',
  imports: [SurveyParticipation, StartSurveyButtonComponent, SurveyResults],
  templateUrl: './survey-voting.html',
  styleUrl: './survey-voting.scss',
})
export class SurveyVoting {}
