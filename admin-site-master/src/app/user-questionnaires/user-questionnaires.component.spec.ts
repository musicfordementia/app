import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionnairesComponent } from './user-questionnaires.component';

describe('UserAnswersComponent', () => {
  let component: UserQuestionnairesComponent;
  let fixture: ComponentFixture<UserQuestionnairesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserQuestionnairesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuestionnairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
