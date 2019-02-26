import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeNgTreeComponent } from './prime-ng-tree.component';

describe('PrimeNgTreeComponent', () => {
  let component: PrimeNgTreeComponent;
  let fixture: ComponentFixture<PrimeNgTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeNgTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeNgTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
