import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MentalEffortLevelEditComponent } from './mental-effort-level-edit.component';

describe('MentalEffortLevelEditComponent', () => {
  let component: MentalEffortLevelEditComponent;
  let fixture: ComponentFixture<MentalEffortLevelEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MentalEffortLevelEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MentalEffortLevelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
