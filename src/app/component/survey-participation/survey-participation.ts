import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../shared/services/survey-service'
import { SurveyResults} from '../survey-results/survey-results'

@Component({
  selector: 'app-survey-participation',
  imports: [CommonModule],
  templateUrl: './survey-participation.html',
  styleUrl: './survey-participation.scss',
})
export class SurveyParticipation implements OnInit {
  constructor(private route: ActivatedRoute) { }
  serviceData = inject(SurveyService)
  resultsFunktion = inject(SurveyResults)

  surveyInfo = signal<any[]>([])
  surveyQuestons = signal<any[]>([])

  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    let d = this.serviceData.surveys().filter(survey => survey.id == id)
    this.surveyInfo.set(d)
    this.loadQuestons(id);
  }

  async loadQuestons(id: string | null) {
    let idNum: number = Number(id);
    this.serviceData.getSurveyQuestions(idNum);
    this.surveyQuestons.set(this.serviceData.surveyQuestions());
  }
}
