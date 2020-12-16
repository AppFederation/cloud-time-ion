import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonVirtualListComponent } from './ion-virtual-list.component';

describe('IonVirtualListComponent', () => {
  let component: IonVirtualListComponent;
  let fixture: ComponentFixture<IonVirtualListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonVirtualListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonVirtualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
