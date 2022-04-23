import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MinMidMaxCellComponent } from './min-mid-max-cell.component';

describe('MinMidMaxCellComponent', () => {
  let component: MinMidMaxCellComponent;
  let fixture: ComponentFixture<MinMidMaxCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinMidMaxCellComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MinMidMaxCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
