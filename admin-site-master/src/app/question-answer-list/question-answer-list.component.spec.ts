import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerListComponent } from './question-answer-list.component';

describe('QuestionAnswerListComponent', () => {
  let component: QuestionAnswerListComponent;
  let fixture: ComponentFixture<QuestionAnswerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAnswerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
