import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerAddComponent } from './question-answer-add.component';

describe('QuestionAnswerAddComponent', () => {
  let component: QuestionAnswerAddComponent;
  let fixture: ComponentFixture<QuestionAnswerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
