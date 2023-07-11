import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintBenefitsComponent } from './hint-benefits.component';

describe('HintBenefitsComponent', () => {
  let component: HintBenefitsComponent;
  let fixture: ComponentFixture<HintBenefitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintBenefitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
