import { Component, inject } from '@angular/core';
import { SurveyService } from '../../shared/services/survey-service'
import { CommonModule} from '@angular/common'

@Component({
  selector: 'app-ending-survey',
  imports: [CommonModule],
  templateUrl: './ending-survey.html',
  styleUrl: './ending-survey.scss',
})
export class EndingSurvey {
  surveyService = inject(SurveyService)

  showLeftDays(endDate: number) {
    const today = new Date();
    const end = new Date(endDate);

    const differenceInMs = end.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));

    if (differenceInDays <= 0) {
      return 'Ends Today'
    }else{
      return `Ends in ${differenceInDays} Days`;
    }

  }
}
