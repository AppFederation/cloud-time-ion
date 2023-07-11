import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OccupationsPage } from './occupations.page';

describe('OccupationsPage', () => {
  let component: OccupationsPage;
  let fixture: ComponentFixture<OccupationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OccupationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
