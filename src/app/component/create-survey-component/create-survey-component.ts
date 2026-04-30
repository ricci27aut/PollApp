import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu'
import { SurveyService } from '../../shared/services/survey-service'

@Component({
  selector: 'app-create-survey-component',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule, DropdownMenu],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {
  private fb = inject(FormBuilder);
  surveyService = inject(SurveyService)

  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    end_at: [''],
    category: ['']
  });

  questionsForm = this.fb.group({
    questions: this.fb.array([
      this.createQuestion()
    ])
  });

  createQuestion() {
    return this.fb.group({
      question: ['', Validators.required],
      allowMultiple: [false],
      answers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  get questions() {
    return this.questionsForm.get('questions') as FormArray;
  }

  answers(i: number) {
    return this.questions.at(i).get('answers') as FormArray;
  }


  addQuestion() {
    if (this.questions.length >= 4) return;
    this.questions.push(this.createQuestion());
  }

  deleteQuestion(i: number) {
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

  addAnswer(i: number) {
    if (this.answers(i).length >= 6) return;
    this.answers(i).push(this.fb.control(''));
  }

  deleteAnswer(i: number, y: number) {
    if (y <= 1) {
      this.answers(i).at(y).setValue('');
    } else {
      this.answers(i).removeAt(y);
    }
  }

  cleanInput(input: string) {
    this.surveyForm.get(input)?.setValue('');
  }

  checkFormValue() {
    if (this.surveyForm.invalid) {
      /* this.surveyForm.markAllAsTouched(); */
      return;
    }

    if (this.questionsForm.invalid) {
      /*  this.questionsForm.markAllAsTouched(); */
      return;
    }
    this.publishSurvey()
  }

  async publishSurvey() {
    let formData = {
      title: this.surveyForm.controls.title.value || '',
      description: this.surveyForm.controls.description.value || '',
      ends_at: this.surveyForm.controls.end_at.value || null,
      category: this.surveyForm.controls.category.value || 'Team Activities',
    };

    const newSurvey = await this.surveyService.addSurvey(formData);
    if (!newSurvey) return;
    const surveyId = newSurvey.id;

    this.publshQuestions(surveyId)
  }

  publshQuestions(id: number) {
    const questionsData = this.questionsForm.controls.questions.value.map((question: any) => {
      return {
        survey_id: id,
        question: question.question,
        answers: question.answers
      };
    });

    this.surveyService.addSurveyQuestons(questionsData)
  }




  AlowMultiAnswers(i: number) {
    const control = this.questions.at(i).get('allowMultiple');
    control?.setValue(!control.value);
  }

  userFeedBack() {

  }

  clearForm() {

  }
}



