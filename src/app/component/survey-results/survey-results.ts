import { Component, inject, signal, } from '@angular/core';
import { SurveyService } from '../../shared/services/survey-service'
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-results',
  imports: [CommonModule],
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults {
  constructor(private route: ActivatedRoute) { }
  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  showResults: boolean = false;

  surveyService = inject(SurveyService)

  questions = signal<any[]>([]);
  totalVotes = signal<number>(0);

  async loadSurveyResults() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    await this.surveyService.getSurveyQuestions(id);
    let tv = this.surveyService.surveys().filter(surveys => surveys.id == id)[0].votings;
    this.totalVotes.set(tv);
    this.questions.set(this.surveyService.surveyQuestions());

    this.showResults = true;

    console.log(this.questions());
    console.log(this.totalVotes());
    
  }

  getPercentage(votes:number){

    return Math.round((votes / this.totalVotes()) * 100);
  }
}
