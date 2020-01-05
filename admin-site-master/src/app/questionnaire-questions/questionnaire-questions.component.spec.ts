import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireQuestionsComponent } from './questionnaire-questions.component';

describe('QuestionnaireQuestionsComponent', () => {
  let component: QuestionnaireQuestionsComponent;
  let fixture: ComponentFixture<QuestionnaireQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
