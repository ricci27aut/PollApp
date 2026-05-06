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

 get displayedSurveys() {
  return this.surveyService.categorySurveys();
}

  showLeftDays(endDate: number) {
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

  showSurveyVoting(title: string, id: number) {
    this.router.navigate([id, title, 'voting']);
  }
}
