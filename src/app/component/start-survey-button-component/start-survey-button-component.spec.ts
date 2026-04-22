import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSurveyButtonComponent } from './start-survey-button-component';

describe('StartSurveyButtonComponent', () => {
  let component: StartSurveyButtonComponent;
  let fixture: ComponentFixture<StartSurveyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartSurveyButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartSurveyButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
