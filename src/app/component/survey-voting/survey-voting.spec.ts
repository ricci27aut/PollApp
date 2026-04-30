import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyVoting } from './survey-voting';

describe('SurveyVoting', () => {
  let component: SurveyVoting;
  let fixture: ComponentFixture<SurveyVoting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyVoting],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyVoting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
