import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearnItemDetailsHintsComponent } from './learn-item-details-hints.component';

describe('LearnItemDetailsHintsComponent', () => {
  let component: LearnItemDetailsHintsComponent;
  let fixture: ComponentFixture<LearnItemDetailsHintsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnItemDetailsHintsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearnItemDetailsHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
