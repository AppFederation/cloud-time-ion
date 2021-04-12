import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FancyWaterComponent } from './fancy-water.component';

describe('FancyWaterComponent', () => {
  let component: FancyWaterComponent;
  let fixture: ComponentFixture<FancyWaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancyWaterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FancyWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
