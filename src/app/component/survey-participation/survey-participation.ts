import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../shared/services/survey-service'

@Component({
  selector: 'app-survey-participation',
  imports: [CommonModule],
  templateUrl: './survey-participation.html',
  styleUrl: './survey-participation.scss',
})
export class SurveyParticipation implements OnInit {
  constructor(private route: ActivatedRoute) { }
  serviceData = inject(SurveyService)

  surveyInfo = signal<any[]>([])
  surveyQuestons = signal<any[]>([])

  letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    let d = this.serviceData.surveys.filter(survey => survey.id == id)
    this.surveyInfo.set(d)

    this.loadQuestons()
  }

  async loadQuestons() {
    let id = this.route.snapshot.paramMap.get('id');
    let idNum: number = Number(id);
    const { data, error } = await this.serviceData.getSurveyQuestions(idNum); // anschauen akleren lassen
    this.surveyQuestons.set(data || [])
  }
}
