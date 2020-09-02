import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LearnStatsPage } from './learn-stats.page';

describe('LearnStatsPage', () => {
  let component: LearnStatsPage;
  let fixture: ComponentFixture<LearnStatsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnStatsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LearnStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
