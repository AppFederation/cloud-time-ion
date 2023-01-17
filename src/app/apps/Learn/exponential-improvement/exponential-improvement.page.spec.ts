import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExponentialImprovementPage } from './exponential-improvement.page';

describe('ExponentialImprovementPage', () => {
  let component: ExponentialImprovementPage;
  let fixture: ComponentFixture<ExponentialImprovementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExponentialImprovementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExponentialImprovementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});