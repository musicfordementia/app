import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireAddComponent } from './questionnaire-add.component';

describe('QuestionnaireAddComponent', () => {
  let component: QuestionnaireAddComponent;
  let fixture: ComponentFixture<QuestionnaireAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionnaireAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionnaireAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
