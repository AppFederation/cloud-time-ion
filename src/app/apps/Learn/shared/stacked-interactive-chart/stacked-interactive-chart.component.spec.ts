import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StackedInteractiveChartComponent } from './stacked-interactive-chart.component';

describe('StackedInteractiveChartComponent', () => {
  let component: StackedInteractiveChartComponent;
  let fixture: ComponentFixture<StackedInteractiveChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedInteractiveChartComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedInteractiveChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
