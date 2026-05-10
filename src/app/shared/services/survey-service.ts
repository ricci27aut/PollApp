import { Injectable, signal } from '@angular/core';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Survey, SurveyQuestions }  from '../moduls/sureve-modul-module'

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  supabaseUrl = 'https://riunbocqbbeuzxizfooe.supabase.co';
  supabaseKey = 'sb_publishable_JchZljAg8ekEHsnptMhN3Q_r8w5w9zm';
  sbSurvey = createClient(this.supabaseUrl, this.supabaseKey);

  surveys = signal<Survey[]>([]);
  endingSurveys = signal<Survey[]>([]);
  categorySurveys = signal<Survey[]>([])
  pastSurveys = signal<Survey[]>([]);
  surveyQuestions = signal<SurveyQuestions[]>([]);
  totalVotes = signal<number>(0);
  channels: RealtimeChannel | undefined;

  /**
   * Subscribes to new survey inserts and refreshes the local survey lists.
   */
  serverEventListener(): void {
    if (this.channels) return;
    this.channels = this.sbSurvey.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'survey_list' },
        (payload) => {
          this.surveys.update(surveys => [...surveys, payload.new as Survey]);
          this.updateSurveyLists();
        }
      )
      .subscribe((status) => {
      });
  }

  /**
   * Removes the active realtime channel when the service is destroyed.
   */
  ngOnDestroy(): void {
    if (this.channels) this.sbSurvey.removeChannel(this.channels);
  }

  /**
   * Loads all surveys from Supabase and updates the derived survey lists.
   */
  async getSurvey(): Promise<void> {
    let { data: survey, error } = await this.sbSurvey
      .from('survey_list')
      .select('id, title, description, ends_at, category, votings');
    if (!survey) return;

    this.surveys.set(survey ?? []);
    this.updateSurveyLists();
    this.serverEventListener()
  }

  /**
   * Updates the ending, past, and category survey lists.
   */
  updateSurveyLists(): void {
    this.getEndingSurveys();
    this.getCategorySurveys('Team Activities', false);
  }

  /**
   * Loads all questions for a survey from Supabase.
   * @param surveyId The selected survey id.
   */
  async getSurveyQuestions(surveyId: number): Promise<void> {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId);
    this.surveyQuestions.set(data ?? []);
  }

  /**
   * Adds a new survey to Supabase.
   * @param survey The survey data to insert.
   * @returns The created survey entry.
   */
  async addSurvey(survey: { title: string, description: string, ends_at?: string | null, category: string, votings: number }): Promise<Survey | null> {
    const { data, error } = await this.sbSurvey
      .from('survey_list')
      .insert([survey])
      .select()
      .single();
    return data;
  }

  /**
   * Adds all questions for a survey to Supabase.
   * @param questionsData The question data to insert.
   */
  async addSurveyQuestons(questionsData: {
    survey_id: number,
    question: string,
    answers: string[]
    allowMultiple: boolean,
    answer_votes: number[];
  }[]): Promise<void> {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .insert(questionsData)
      .select()
  }

  /**
   * Updates the active ending-soon surveys and expired surveys.
   */
  getEndingSurveys(): void {
    const now = new Date().getTime();
    const activeSurveys = this.getActiveSurveys(now)
    const expiredSurveys = this.expiredSurveys(now)

    this.endingSurveys.set(activeSurveys);
    this.pastSurveys.set(expiredSurveys);
  }

  /**
   * Gets active surveys ordered by the nearest end date.
   * @param now The current timestamp.
   * @returns The next active surveys.
   */
  getActiveSurveys(now: number): Survey[] {
    return this.surveys()
      .filter(survey => survey.ends_at)
      .filter(survey => new Date(survey.ends_at).getTime() >= now)
      .sort((a, b) =>
        new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
      )
      .slice(0, 3);
  }

  /**
   * Gets expired surveys ordered by the most recent end date.
   * @param now The current timestamp.
   * @returns All expired surveys.
   */
  expiredSurveys(now: number): Survey[] {
    return this.surveys()
      .filter(survey => survey.ends_at)
      .filter(survey => new Date(survey.ends_at).getTime() < now)
      .sort((a, b) =>
        new Date(b.ends_at).getTime() - new Date(a.ends_at).getTime()
      );
  }

  /**
   * Filters surveys by category and active or past state.
   * @param category The selected survey category.
   * @param showPastSurveys Whether past surveys should be shown.
   */
  getCategorySurveys(category: string, showPastSurveys: boolean): void {
    const now = Date.now();

    const filteredSurveys = this.surveys()
      .filter(survey => survey.category === category)
      .filter(survey => {
        const isPast = new Date(survey.ends_at).getTime() < now;
        return showPastSurveys ? isPast : !isPast;
      });

    this.categorySurveys.set(filteredSurveys);
  }

  /**
   * Updates the vote counts for one question.
   * @param questionId The question id to update.
   * @param answerVotes The updated answer vote counts.
   * @returns The updated question data.
   */
  async updateQuestionVotes(questionId: number, answerVotes: number[]) {
    const { data, error } = await this.sbSurvey
      .from('questions')
      .update({ answer_votes: answerVotes })
      .eq('id', questionId)
      .select();

    return data;
  }

  /**
   * Increments the total voting count for a survey.
   * @param surveyId The selected survey id.
   */
  async incrementSurveyVotings(surveyId: number) {
    const survey = this.surveys().find(s => s.id === surveyId);
    if (!survey) return;
    const { data, error } = await this.sbSurvey
      .from('survey_list')
      .update({ votings: this.totalVotes() })
      .eq('id', surveyId)
      .select();
  }

 /**
 * Updates the local vote count for one answer in the survey questions signal.
 * @param question The question whose answer votes should be updated.
 * @param answerIndex The index of the answer to update.
 * @param change The vote change amount. Use 1 to add a vote and -1 to remove one.
 */
updateLocalVote(question: any, answerIndex: number, change: number): void {
  this.surveyQuestions.update(questions =>
    questions.map(currentQuestion => {
      if (currentQuestion.id !== question.id) return currentQuestion;

      const updatedVotes = [...currentQuestion.answer_votes];
      updatedVotes[answerIndex] = (updatedVotes[answerIndex] ?? 0) + change;

      return {
        ...currentQuestion,
        answer_votes: updatedVotes
      };
    })
  );
}
/**
 * Updates the local vote count
 */
  updateLocalTotalVotes(change: number): void {
    this.totalVotes.update(votes => Math.max(0, votes + change));
  }
}
