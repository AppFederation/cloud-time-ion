import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntersectionObserverListComponent } from './intersection-observer-list.component';

describe('IntersectionObserverListComponent', () => {
  let component: IntersectionObserverListComponent;
  let fixture: ComponentFixture<IntersectionObserverListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntersectionObserverListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntersectionObserverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
