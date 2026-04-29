import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../../shared/services/survey-service'

@Component({
  selector: 'app-dropdown-menu',
  imports: [CommonModule],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenu {

  surveyService = inject(SurveyService)

  categories= [ 'Team Activities','Health & Wellness','Gaming & Entertainment','Education & Learning','Lifestyle & Preferences','Technology & Innovation',]
  iconPath = 'assets/img/dropDown/arrow_drop_down.png'
  isHover = false;
  isClosed = true;
  isSelected = true;
  whichChoice = 0;


  openDropDown(){
    if(this.isClosed == false) return this.closeDropDown()
    this.iconPath= 'assets/img/dropDown/arrow_drop_down_open.png'
    this.isHover = true;
    this.isClosed = false;
  }

  closeDropDown(){
    this.isHover = false;
    this.isClosed = true;

    if(this.isSelected){
      this.iconPath = 'assets/img/dropDown/arrow_drop_down.png'
    }else{
      this.iconPath = 'assets/img/dropDown/arrow_drop_down_open.png'
    }
  }

  showChoice(i: number){
    this.whichChoice = i
    this.isSelected = false;
    this.closeDropDown();
  }

}


