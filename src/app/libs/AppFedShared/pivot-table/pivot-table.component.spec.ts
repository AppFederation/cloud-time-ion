import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PivotTableComponent } from './pivot-table.component';

describe('PivotTableComponent', () => {
  let component: PivotTableComponent;
  let fixture: ComponentFixture<PivotTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PivotTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PivotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
