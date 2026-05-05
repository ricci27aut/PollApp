import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseUrl = 'https://riunbocqbbeuzxizfooe.supabase.co';
  supabaseKey = 'sb_publishable_JchZljAg8ekEHsnptMhN3Q_r8w5w9zm';
  sbSurvey = createClient(this.supabaseUrl, this.supabaseKey);

  surveys = signal<any[]>([]);
  endingSurveys = signal<any[]>([]);
  categorySurveys = signal<any[]>([])
  pastSurveys = signal<any[]>([]);
  surveyQuestions = signal<any[]>([]);
  channels: RealtimeChannel | undefined;

  serverEventListener() {
    if (this.channels) return;
    this.channels = this.sbSurvey.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'survey_list' },
        (payload) => {
          this.surveys.update(surveys => [...surveys, payload.new]);
          this.updateSurveyLists();
        }
      )
      .subscribe((status) => {
      });
  }

  ngOnDestroy() {
    if (this.channels) this.sbSurvey.removeChannel(this.channels);
  }

  async getSurvey() {
    let { data: survey, error } = await this.sbSurvey
      .from('survey_list')
      .select('id, title, description, ends_at, category, votings');
    if (!survey) return;

    this.surveys.set(survey ?? []);
    this.updateSurveyLists();
    this.serverEventListener()
  }

  updateSurveyLists() {
    this.getEndingSurveys();
    this.getCategorySurveys('Team Activities');
  }

  async getSurveyQuestions(surveyId: number) {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId);
    this.surveyQuestions.set(data ?? []);
  }

  async addSurvey(survey: { title: string, description: string, ends_at?: string | null, category: string, votings:number}) {
    const { data, error } = await this.sbSurvey
      .from('survey_list')
      .insert([survey])
      .select()
      .single();
    return data;
  }

  async addSurveyQuestons(questionsData: {
    survey_id: number,
    question: string,
    answers: string[]
    allowMultiple: boolean,
    answer_votes: number[];
  }[]) {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .insert(questionsData)
      .select()
  }

  getEndingSurveys() {
    const now = new Date().getTime();

    const activeSurveys = this.surveys()
      .filter(survey => survey.ends_at)
      .filter(survey => new Date(survey.ends_at).getTime() >= now)
      .sort((a, b) =>
        new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
      )
      .slice(0, 3);

    const expiredSurveys = this.surveys()
      .filter(survey => survey.ends_at)
      .filter(survey => new Date(survey.ends_at).getTime() < now)
      .sort((a, b) =>
        new Date(b.ends_at).getTime() - new Date(a.ends_at).getTime()
      );

    this.endingSurveys.set(activeSurveys);
    this.pastSurveys.set(expiredSurveys);
  }

  getCategorySurveys(category: string) {
    const filteredSurveys = this.surveys().filter(
      survey => survey.category === category
    );

    this.categorySurveys.set(filteredSurveys);
  }

  async updateQuestionVotes(questionId: number, answerVotes: number[]) {
  const { data, error } = await this.sbSurvey
    .from('questions')
    .update({ answer_votes: answerVotes })
    .eq('id', questionId)
    .select();

  return data;
}

 async incrementSurveyVotings(surveyId: number){
  const survey = this.surveys().find(s => s.id === surveyId);
  const { data, error } = await this.sbSurvey
  .from('survey_list')
  .update({ votings: survey.votings + 1 })
  .eq('id', surveyId)
  .select();
 }
}
