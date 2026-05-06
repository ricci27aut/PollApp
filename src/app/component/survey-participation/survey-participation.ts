import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../shared/services/survey-service'


@Component({
  selector: 'app-survey-participation',
  imports: [CommonModule],
  templateUrl: './survey-participation.html',
  styleUrl: './survey-participation.scss',
})
export class SurveyParticipation implements OnInit {
  constructor(private route: ActivatedRoute) { }
  serviceData = inject(SurveyService)
  router = inject(Router);

  @Output() votingSubmitted = new EventEmitter<void>();

  surveyInfo = signal<any[]>([])
  surveyQuestons = signal<any[]>([])
  selectedAnswers: { [questionId: number]: number[] } = {};

  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

  notAllAnswersSelected = false;


  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!this.serviceData.surveys().length) {
      await this.serviceData.getSurvey();
    }
    let d = this.serviceData.surveys().filter(survey => survey.id == id)
    this.surveyInfo.set(d)
    this.loadQuestons(id);
  }

  async loadQuestons(id: string | null) {
    let idNum: number = Number(id);
    await this.serviceData.getSurveyQuestions(idNum);
    this.surveyQuestons.set(this.serviceData.surveyQuestions());
  }

  async submitVoting() {
    if (!this.allQuestionsAnswered()) {
    this.notAllAnswersSelected = true;
    return;
  }
    await this.publsichQuestonVotings();
    await this.serviceData.incrementSurveyVotings(this.surveyInfo()[0].id);
    this.router.navigate(['/']);
  }

  toggleAnswer(question: any, answerIndex: number) {
    const questionId = question.id;
    const selected = this.selectedAnswers[questionId] ?? [];

    if (question.allowMultiple) {
      if (selected.includes(answerIndex)) {
        this.selectedAnswers[questionId] = selected.filter(index => index !== answerIndex);
      } else {
        this.selectedAnswers[questionId] = [...selected, answerIndex];
      }
    } else {
      this.selectedAnswers[questionId] = [answerIndex];
    }
  }

  async publsichQuestonVotings() {
    for (const question of this.surveyQuestons()) {
      const selected = this.selectedAnswers[question.id] ?? [];
      if (!selected.length) continue;
      const updatedVotes = [...question.answer_votes];
      selected.forEach(answerIndex => {
        updatedVotes[answerIndex] = (updatedVotes[answerIndex] ?? 0) + 1;
      });

      await this.serviceData.updateQuestionVotes(question.id, updatedVotes);
      this.router.navigate(['/']);
    }
  }

  isAnswerSelected(question: any, answerIndex: number) {
    return this.selectedAnswers[question.id]?.includes(answerIndex) ?? false;
  }

  allQuestionsAnswered() {
  return this.surveyQuestons().every(question => {
    const selected = this.selectedAnswers[question.id] ?? [];
    return selected.length > 0;
  });
}
}
