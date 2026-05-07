import { Component, inject, Input } from '@angular/core';
import { SurveyService } from '../../shared/services/survey-service'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-overview',
  imports: [CommonModule],
  templateUrl: './survey-overview.html',
  styleUrl: './survey-overview.scss',
})
export class SurveyOverview {
  constructor(private router: Router) { }

  surveyService = inject(SurveyService);
  selectedArray: string = 'survey'
  @Input() showPastSurveys: boolean = false;

 /**
  * Returns the currently selected category surveys from the survey service.
  */
 get displayedSurveys(): any[] {
  return this.surveyService.categorySurveys();
}

  /**
   * Creates a readable status text for the survey end date.
   * @param endDate The survey end date.
   * @returns A text that describes when the survey ends.
   */
  showLeftDays(endDate: number): string {
    const today = new Date();
    const end = new Date(endDate);

    const differenceInMs = end.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return 'Ends Today'
    }else if(differenceInDays <= 0){
      return 'Survey Ended'
    }else {
      return `Ends in ${differenceInDays} Days`;
    }
  }

  /**
   * Navigates to the voting page for the selected survey.
   * @param title The selected survey title.
   * @param id The selected survey id.
   */
  showSurveyVoting(title: string, id: number): void {
    this.router.navigate([id, title, 'voting']);
  }
}
