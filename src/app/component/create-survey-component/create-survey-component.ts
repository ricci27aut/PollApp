import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule, FormArray, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu'
import { SurveyService } from '../../shared/services/survey-service'
import { Router } from '@angular/router';
import { Survey } from '../../shared/moduls/sureve-modul-module'

@Component({
  selector: 'app-create-survey-component',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, DropdownMenu],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {
  private fb = inject(FormBuilder);
  surveyService = inject(SurveyService)
  router = inject(Router)

  letters: string[] = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
  publishedIconPath: string = 'assets/img/CeateSurvey/draft.png';
  today: string = new Date().toISOString().split('T')[0];
  showUserFeedack: boolean = false
  noCategory: boolean = false
  userFeddBack: boolean = false

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    end_at: [''],
    category: [''],
    votings: [0]
  });

  questionsForm = this.fb.group({
    questions: this.fb.array([
      this.createQuestion()
    ])
  });

  /**
   * Creates a new question form group with two required answer fields.
   * @returns The created question form group.
   */
  createQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      allowMultiple: [false],
      answers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      answer_votes: this.fb.array([0, 0]),
    });
  }

  /**
   * Returns the questions form array.
   */
  get questions(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  /**
   * Returns the answers form array for a question.
   * @param i The question index.
   */
  answers(i: number): FormArray {
    return this.questions.at(i).get('answers') as FormArray;
  }

  /**
   * Adds a new question when the maximum question count is not reached.
   */
  addQuestion(): void {
    if (this.questions.length >= 4) return;
    this.questions.push(this.createQuestion());
  }

  /**
   * Returns the answer vote form array for a question.
   * @param i The question index.
   */
  answer_votes(i: number): FormArray {
    return this.questions.at(i).get('answer_votes') as FormArray;
  }

  /**
   * Deletes a question or resets the first question when it cannot be removed.
   * @param i The question index.
   */
  deleteQuestion(i: number): void {
    if (i === 0) {
      this.questions.at(i).reset({
        question: '',
        allowMultiple: false,
        answers: ['', '']
      });
    } else {
      this.questions.removeAt(i);
    }
  }

  /**
   * Adds an answer to a question when the maximum answer count is not reached.
   * @param i The question index.
   */
  addAnswer(i: number): void {
    if (this.answers(i).length >= 6) return;
    this.answers(i).push(this.fb.control(''));
    this.answer_votes(i).push(this.fb.control(0));
  }

  /**
   * Deletes an answer or clears one of the required default answers.
   * @param i The question index.
   * @param y The answer index.
   */
  deleteAnswer(i: number, y: number): void {
    if (y <= 1) {
      this.answers(i).at(y).setValue('');
    } else {
      this.answers(i).removeAt(y);
      this.answer_votes(i).removeAt(y);
    }
  }

  /**
   * Clears a survey detail form input.
   * @param input The form control name to clear.
   */
  cleanInput(input: string): void {
    this.surveyForm.get(input)?.setValue('');
  }

  /**
   * Validates the form and publishes the survey when all required values exist.
   */
  checkFormValue(): void {
    this.surveyForm.markAllAsTouched();
    this.questionsForm.markAllAsTouched();

    if (this.surveyForm.invalid || this.questionsForm.invalid || this.surveyForm.get('category')?.value === '') {
      this.userFeddBack = true;
      if (this.surveyForm.get('category')?.value === '') {
        this.noCategory = true;
      }
      return;
    }
    this.noCategory = false;
    this.userFeddBack = false;
    this.publishSurvey();
    this.userFeedBack();
  }

  /**
   * Stores the selected survey category in the survey form.
   * @param type The selected category.
   */
  handleSurveyChange(type: string): void {
    this.surveyForm.controls.category.setValue(type);
  }

  /**
   * Creates the survey entry and publishes its questions.
   */
  async publishSurvey(): Promise<void> {
    let formData: Omit<Survey, 'id'> = {
      title: this.surveyForm.controls.title.value || '',
      description: this.surveyForm.controls.description.value || '',
      ends_at: this.surveyForm.controls.end_at.value || this.getDefaultEndDate(),
      category: this.surveyForm.controls.category.value || 'Team Activities',
      votings: this.surveyForm.controls.votings.value || 0
    };

    const newSurvey = await this.surveyService.addSurvey(formData);
    if (!newSurvey) return;
    const surveyId = newSurvey.id;

    this.publshQuestions(surveyId);
  }

  /**
   * Builds and saves all question data for a survey.
   * @param id The created survey id.
   */
  publshQuestions(id: number): void {
    const questionsData = this.questionsForm.controls.questions.value.map((question: any) => {
      return {
        survey_id: id,
        question: question.question,
        answers: question.answers,
        allowMultiple: question.allowMultiple,
        answer_votes: question.answer_votes
      };
    });

    this.surveyService.addSurveyQuestons(questionsData)
  }

  /**
   * Toggles whether a question allows multiple answers.
   * @param i The question index.
   */
  AlowMultiAnswers(i: number): void {
    const control = this.questions.at(i).get('allowMultiple');
    control?.setValue(!control.value);
  }

  /**
   * Shows the user feedback message after publishing.
   */
  userFeedBack(): void {
    this.publishedIconPath = 'assets/img/CeateSurvey/published.png'
    this.showUserFeedack = true;
    setTimeout(() => {
      this.clearForm();
    }, 1000);
  }

    /**
     * Navigates back to the start page.
     */
    clearForm(): void {
      this.router.navigate(['/']);
    }

    /**
     * Creates a default end date thirty days from today.
     * @returns The default end date as an ISO string.
     */
    getDefaultEndDate(): string {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      return endDate.toISOString();
    }
  }

