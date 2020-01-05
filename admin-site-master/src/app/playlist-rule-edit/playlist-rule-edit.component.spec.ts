import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRuleEditComponent } from './playlist-rule-edit.component';

describe('PlaylistRuleEditComponent', () => {
  let component: PlaylistRuleEditComponent;
  let fixture: ComponentFixture<PlaylistRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
