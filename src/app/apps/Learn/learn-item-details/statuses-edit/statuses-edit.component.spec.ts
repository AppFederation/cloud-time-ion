import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusesEditComponent } from './statuses-edit.component';

describe('StatusesEditComponent', () => {
  let component: StatusesEditComponent;
  let fixture: ComponentFixture<StatusesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusesEditComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
