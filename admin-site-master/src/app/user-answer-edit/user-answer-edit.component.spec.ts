import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAnswerEditComponent } from './user-answer-edit.component';

describe('UserAnswerEditComponent', () => {
  let component: UserAnswerEditComponent;
  let fixture: ComponentFixture<UserAnswerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAnswerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAnswerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
