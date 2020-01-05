import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningDiaryComponent } from './listening-diary.component';

describe('ListeningDiaryComponent', () => {
  let component: ListeningDiaryComponent;
  let fixture: ComponentFixture<ListeningDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeningDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeningDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
