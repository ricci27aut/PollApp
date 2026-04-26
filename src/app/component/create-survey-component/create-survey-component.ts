import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators,FormsModule,FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-survey-component',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {
  private fb = inject(FormBuilder);

  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    end_at: [''],
    questions: this.fb.array([
      this.createQuestion()
    ])
  });

  createQuestion() {
    return this.fb.group({
      question: [''],
      allowMultiple: [false],
      answers: this.fb.array([
        this.fb.control(''),
        this.fb.control('')
      ])
    });
  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
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

  publishSurvey() {
    console.log(this.surveyForm.value);
    this.userFeedBack();
    this.clearForm();
  }

  userFeedBack(){

  }

  clearForm(){

  }
}



