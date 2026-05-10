import { Component, effect, inject, OnInit } from '@angular/core';
import { SurveyService } from '../../shared/services/survey-service'
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-results',
  imports: [CommonModule],
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults implements OnInit {
  constructor(private route: ActivatedRoute) { }
  letters: string[] = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  showResults: boolean = false;

  surveyService = inject(SurveyService)

  questions = this.surveyService.surveyQuestions;
  totalVotes = this.surveyService.totalVotes;
  showResultsEffect = effect(() => {
    this.showResults = this.totalVotes() > 0;
  });

  isResultsOpen: boolean = false;


  /**
   * Loads the current survey vote count and shows results when votes exist.
   */
  async ngOnInit(): Promise<void> {
    let id = await this.getTotalVotes()
    await this.loadSurveyResults(id)

    if (this.totalVotes() === 0) {
      return
    } else {
      this.showResults = true;
    }
  }

  /**
   * Loads all questions for the selected survey and enables the results view.
   * @param id The id of the selected survey.
   */
  async loadSurveyResults(id: number): Promise<void> {
    await this.surveyService.getSurveyQuestions(id);
  }

  /**
   * Calculates the percentage for one answer based on all survey votes.
   * @param votes The vote count of one answer.
   * @returns The rounded answer percentage.
   */
  getPercentage(votes: number): number {
    if (this.totalVotes() === 0) return 0;
    return Math.round((votes / this.totalVotes()) * 100);
  }

  /**
   * Gets the current survey id from the route and stores its total vote count.
   * @returns The selected survey id.
   */
  async getTotalVotes(): Promise<number> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    let survey = this.surveyService.surveys().find(survey => survey.id == id);
    if (!survey) {
      await this.surveyService.getSurvey();
      survey = this.surveyService.surveys().find(survey => survey.id == id);
    }
    if (!survey) return id;
    this.totalVotes.set(survey.votings);
    return id;
  }

  /**
   * Toggles the mobile results area between open and closed.
   */
  toggleResultsMobile(): void {
    if (this.isResultsOpen == false) {
      this.isResultsOpen = true;
    } else {
      this.isResultsOpen = false;
    }

  }
}
