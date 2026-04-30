import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseUrl = 'https://riunbocqbbeuzxizfooe.supabase.co';
  supabaseKey = 'sb_publishable_JchZljAg8ekEHsnptMhN3Q_r8w5w9zm';
  sbSurvey = createClient(this.supabaseUrl, this.supabaseKey);

  surveys: any[] = [];
  endingSurveys = signal<any[]>([]);
  categorySurveys = signal<any[]>([])


  async getSurvey() {
    let { data: survey, error } = await this.sbSurvey
      .from('survey_list')
      .select('id, title, description, ends_at, category')
    if (!survey) return;

    this.surveys = survey ?? [];
    this.getEndingSurveys()
    this.getCategorySurveys('Team Activities')
    /* his.serverEventListener() */
  }

  async getSurveyQuestions(surveyId: number) {
  return await this.sbSurvey
    .from('questions')
    .select('*')
    .eq('survey_id', surveyId);
}

  async addSurvey(survey: { title: string, description: string, ends_at?: string | null, category: string }) {
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
  }[]) {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .insert(questionsData)
      .select()
  }









  getEndingSurveys() {
    const sortedSurveys = this.surveys
      .filter(survey => survey.ends_at)
      .sort((a, b) =>
        new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
      )
      .slice(0, 3);

    this.endingSurveys.set(sortedSurveys);
  }

  getCategorySurveys(category: string) {
    const filteredSurveys = this.surveys.filter(
      survey => survey.category === category
    );

    this.categorySurveys.set(filteredSurveys);
  }




































  /*   serverEventListener() {
      this.channels = this.supabase.channel('custom-all-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('Change received!', payload)
            this.products.set(payload.new as any);// reloadet die ganze seite produkt tabelle updait ändert in gegendatz nur ein element
          }
        )
        .subscribe()
    }
  
    ngOnDestroy() {
      if (this.channels) this.supabase.removeChannel(this.channels);
    }
  
     async deleteProduct(id: number) {
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id)// es wird das element mit der identischen id gelöscht
  
    } */
}
