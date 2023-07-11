import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RationalePage } from './rationale.page';

describe('RationalePage', () => {
  let component: RationalePage;
  let fixture: ComponentFixture<RationalePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RationalePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RationalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
