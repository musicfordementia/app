import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerEditComponent } from './question-answer-edit.component';

describe('QuestionAnswerEditComponent', () => {
  let component: QuestionAnswerEditComponent;
  let fixture: ComponentFixture<QuestionAnswerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
