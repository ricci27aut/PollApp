import { Component, inject, signal, OnInit } from '@angular/core';
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
  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  showResults: boolean = false;

  surveyService = inject(SurveyService)

  questions = signal<any[]>([]);
  totalVotes = signal<number>(0);

  async ngOnInit(): Promise<void> {
    let id = await this.getTotalVotes()
    if(this.totalVotes() === 0){
      return
    }else{
      this.loadSurveyResults(id);
    }
    
  }

  async loadSurveyResults(id: number) {
    await this.surveyService.getSurveyQuestions(id);
    this.questions.set(this.surveyService.surveyQuestions());

    this.showResults = true;
  }

  getPercentage(votes:number){
    return Math.round((votes / this.totalVotes()) * 100);
  }

 async getTotalVotes() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  let survey = this.surveyService.surveys().find(survey => survey.id == id);
  if (!survey) {
    await this.surveyService.getSurvey();
    survey = this.surveyService.surveys().find(survey => survey.id == id);
  }
  this.totalVotes.set(survey.votings);
  return id;
}
}
