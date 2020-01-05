import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagePlanComponent } from './usage-plan.component';

describe('UsagePlanComponent', () => {
  let component: UsagePlanComponent;
  let fixture: ComponentFixture<UsagePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsagePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsagePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
