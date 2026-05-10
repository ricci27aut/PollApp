import { Component, inject, OnInit } from '@angular/core';
import { SurveyParticipation } from '../survey-participation/survey-participation'
import { StartSurveyButtonComponent } from '../start-survey-button-component/start-survey-button-component'
import { SurveyResults } from '../survey-results/survey-results'
import { SurveyService } from '../../shared/services/survey-service'
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-survey-voting',
  imports: [SurveyParticipation, StartSurveyButtonComponent, SurveyResults, RouterLink],
  templateUrl: './survey-voting.html',
  styleUrl: './survey-voting.scss',
})
export class SurveyVoting implements OnInit {
  surveyService = inject(SurveyService)
  route = inject(ActivatedRoute);

  /**
   * Refreshes the survey data whenever the voting page is opened.
   * Loads the current survey list and questions for the route id, then updates
   * the shared total vote count used by the results view.
   */
  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    await this.surveyService.getSurvey();
    await this.surveyService.getSurveyQuestions(id);

    const survey = this.surveyService.surveys().find(survey => survey.id === id);
    if (survey) {
      this.surveyService.totalVotes.set(survey.votings);
    }
  }
}
