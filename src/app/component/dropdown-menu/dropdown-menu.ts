import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../../shared/services/survey-service'

@Component({
  selector: 'app-dropdown-menu',
  imports: [CommonModule],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenu {
  @Input() headline: string = 'Surveys';
  @Output() surveySelected = new EventEmitter<string>();
  @Input() showPastSurveys: boolean = false;
  surveyService = inject(SurveyService)

  categories: string[] = ['Team Activities', 'Health & Wellness', 'Gaming & Entertainment', 'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation',]
  iconPath: string = 'assets/img/dropDown/arrow_drop_down.png'
  isHover: boolean = false;
  isClosed: boolean = true;
  isSelected: boolean = true;
  whichChoice: number = 0;

  /**
   * Emits the selected survey category to the parent component.
   * @param type The selected survey category.
   */
   selectSurvey(type: string): void {
    this.surveySelected.emit(type);
  }


  /**
   * Opens the dropdown menu or closes it when it is already open.
   */
  openDropDown(): void {
    if (this.isClosed == false) return this.closeDropDown()
    this.iconPath = 'assets/img/dropDown/arrow_drop_down_open.png'
    this.isHover = true;
    this.isClosed = false;
  }

  /**
   * Closes the dropdown menu and restores the correct icon state.
   */
  closeDropDown(): void {
    this.isHover = false;
    this.isClosed = true;

    if (this.isSelected) {
      this.iconPath = 'assets/img/dropDown/arrow_drop_down.png'
    } else {
      this.iconPath = 'assets/img/dropDown/arrow_drop_down_open.png'
    }
  }

  /**
   * Stores the selected category index and emits the selected category.
   * @param i The selected category index.
   */
  showChoice(i: number): void {
    this.whichChoice = i
    this.isSelected = false;
    this.closeDropDown();
    this.selectSurvey(this.categories[i])
  }

}
