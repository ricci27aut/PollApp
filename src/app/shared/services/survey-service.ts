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
      .select('title, description, ends_at, category')// filter only name and count

    /*  .like('name', 'Bildschirm')// sucht nach genau dem begriff Bildschierm berücksichtigt auch klein und großschreibung */
    /* .ilike('name', 'bildschirm')// sucht nach genau dem begriff Bildschierm berücksichtigt auch klein und großschreibung */
    if (!survey) return;
    console.log(survey);


    this.surveys = survey ?? [];
    this.getEndingSurveys()
    this.getCategorySurveys('Team Activities')
    /* his.serverEventListener() */
  }

  getEndingSurveys() {
    const sortedSurveys = this.surveys
      .filter(survey => survey.ends_at)
      .sort((a, b) =>
        new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
      )
      .slice(0, 3);

    this.endingSurveys.set(sortedSurveys);
    console.log(this.endingSurveys);
  }

  getCategorySurveys(category: string) {
    const filteredSurveys = this.surveys.filter(
      survey => survey.category === category
    );

    this.categorySurveys.set(filteredSurveys);
    console.log(this.categorySurveys());
  }

  async addSurvey(survey: { title: string, description: string, ends_at?: string | null, category: string }) {
    const { data, error } = await this.sbSurvey
      .from('survey_list')
      .insert([survey])
      .select()
    console.log(data, error);
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
