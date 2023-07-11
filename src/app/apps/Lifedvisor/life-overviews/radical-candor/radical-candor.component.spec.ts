import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RadicalCandorComponent } from './radical-candor.component';

describe('RadicalCandorComponent', () => {
  let component: RadicalCandorComponent;
  let fixture: ComponentFixture<RadicalCandorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadicalCandorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadicalCandorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
