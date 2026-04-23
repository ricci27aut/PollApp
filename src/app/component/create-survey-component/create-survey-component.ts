import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-survey-component',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {
  private fb = inject(FormBuilder);

  questions = [1];
  answer = [1, 2];
  letters = ['A.', 'B.', 'C.', 'D.'];

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    end_at: [''],
    question: [''],
    answer: [''],
  })

  addQuestion() {
    if (this.questions.length >= 6) return
    this.questions.push(1)
  }

  addAnswers() {
    if (this.answer.length >= 4) return
    this.answer.push(1)
  }

  cleanInput(id: string){
    this.surveyForm.get(id)?.setValue('')
  }
}
