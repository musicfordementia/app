import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRuleAddComponent } from './playlist-rule-add.component';

describe('PlaylistRuleAddComponent', () => {
  let component: PlaylistRuleAddComponent;
  let fixture: ComponentFixture<PlaylistRuleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistRuleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistRuleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
