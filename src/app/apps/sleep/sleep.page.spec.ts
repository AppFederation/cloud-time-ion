import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SleepPage } from './sleep.page';

describe('SleepPage', () => {
  let component: SleepPage;
  let fixture: ComponentFixture<SleepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SleepPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SleepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
