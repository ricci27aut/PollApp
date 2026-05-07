import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SureveModulModule {
}

/**
 * Represents a survey entry from the survey list.
 */
export interface Survey {
  id: number;
  title: string;
  description: string;
  ends_at: string;
  category: string;
  votings: number;
}

/**
 * Represents the survey questons entry from the questions.
 */
export interface SurveyQuestions {
  id: number;
  question: string;
  answers: string[];
  survey_id: number;
  answer_votes: number[];
  allowMultiple: boolean;
}

