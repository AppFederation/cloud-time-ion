import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MentalEffortLevelEditComponent } from './mental-effort-level-edit.component';

describe('MentalEffortLevelEditComponent', () => {
  let component: MentalEffortLevelEditComponent;
  let fixture: ComponentFixture<MentalEffortLevelEditComponent>;

  beforeEach(async(() => {
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
