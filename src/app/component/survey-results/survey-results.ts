import { Component, inject, signal } from '@angular/core';
import { SurveyService } from '../../shared/services/survey-service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-survey-results',
  imports: [CommonModule],
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults {
  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  questions = signal<any[]>([])

  surveyService = inject(SurveyService);

   initQuestonVoting() {
    this.questions.set(this.surveyService.surveyQuestions());
    console.log(this.questions());
    
  }
}
