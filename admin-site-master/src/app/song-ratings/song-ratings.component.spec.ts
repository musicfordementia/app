import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRatingsComponent } from './song-ratings.component';

describe('SongRatingsComponent', () => {
  let component: SongRatingsComponent;
  let fixture: ComponentFixture<SongRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
