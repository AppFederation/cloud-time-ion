import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FunLevelEditComponent } from './fun-level-edit.component';

describe('FunLevelEditComponent', () => {
  let component: FunLevelEditComponent;
  let fixture: ComponentFixture<FunLevelEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunLevelEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FunLevelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
