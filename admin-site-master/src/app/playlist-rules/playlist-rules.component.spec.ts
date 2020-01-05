import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRulesComponent } from './playlist-rules.component';

describe('PlaylistRulesComponent', () => {
  let component: PlaylistRulesComponent;
  let fixture: ComponentFixture<PlaylistRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
