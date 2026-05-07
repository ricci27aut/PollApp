import { Component, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../shared/services/survey-service'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey-participation',
  imports: [CommonModule, RouterLink],
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

  letters: string[] = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  notAllAnswersSelected: boolean = false;


  /**
   * Loads the selected survey and its questions from the current route id.
   */
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!this.serviceData.surveys().length) {
      await this.serviceData.getSurvey();
    }
    let d = this.serviceData.surveys().filter(survey => survey.id == Number(id))
    this.surveyInfo.set(d)
    this.loadQuestons(id);
    this.isSurveyEnded();
  }

  /**
   * Loads all questions for the selected survey.
   * @param id The selected survey id from the route.
   */
  async loadQuestons(id: string | null): Promise<void> {
    let idNum: number = Number(id);
    await this.serviceData.getSurveyQuestions(idNum);
    this.surveyQuestons.set(this.serviceData.surveyQuestions());
  }

  /**
   * Submits the selected answers when every question has been answered.
   */
  async submitVoting(): Promise<void> {
    if (!this.allQuestionsAnswered()) {
    this.notAllAnswersSelected = true;
    return;
  }
    await this.publsichQuestonVotings();
    await this.serviceData.incrementSurveyVotings(this.surveyInfo()[0].id);
    this.router.navigate(['/']);
  }

  /**
   * Selects or toggles an answer depending on the question answer mode.
   * @param question The question the answer belongs to.
   * @param answerIndex The index of the clicked answer.
   */
  toggleAnswer(question: any, answerIndex: number): void {
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

  /**
   * Updates the vote counts for all selected answers.
   */
  async publsichQuestonVotings(): Promise<void> {
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

  /**
   * Checks whether an answer is selected for the given question.
   * @param question The question to check.
   * @param answerIndex The answer index to check.
   * @returns True when the answer is selected.
   */
  isAnswerSelected(question: any, answerIndex: number): boolean {
    return this.selectedAnswers[question.id]?.includes(answerIndex) ?? false;
  }

  /**
   * Checks whether every survey question has at least one selected answer.
   * @returns True when all questions are answered.
   */
  allQuestionsAnswered(): boolean {
  return this.surveyQuestons().every(question => {
    const selected = this.selectedAnswers[question.id] ?? [];
    return selected.length > 0;
  });
}

/**
 * Checks whether the selected survey end date is already in the past.
 * @returns True when the survey has ended.
 */
isSurveyEnded(): boolean {
  const survey = this.surveyInfo()[0];
  if (!survey?.ends_at) return false;

  return new Date(survey.ends_at).getTime() < Date.now();
}
}
