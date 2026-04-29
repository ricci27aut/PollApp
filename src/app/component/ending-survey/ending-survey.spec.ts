import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndingSurvey } from './ending-survey';

describe('EndingSurvey', () => {
  let component: EndingSurvey;
  let fixture: ComponentFixture<EndingSurvey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndingSurvey],
    }).compileComponents();

    fixture = TestBed.createComponent(EndingSurvey);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
