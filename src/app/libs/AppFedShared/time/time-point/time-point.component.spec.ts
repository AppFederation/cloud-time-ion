import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimePointComponent } from './time-point.component';

describe('TimePointComponent', () => {
  let component: TimePointComponent;
  let fixture: ComponentFixture<TimePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePointComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
