import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuccessChancePage } from './success-chance.page';

describe('SuccessChancePage', () => {
  let component: SuccessChancePage;
  let fixture: ComponentFixture<SuccessChancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessChancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessChancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
