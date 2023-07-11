import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestVirtualScrollPage } from './test-virtual-scroll.page';

describe('TestVirtualScrollPage', () => {
  let component: TestVirtualScrollPage;
  let fixture: ComponentFixture<TestVirtualScrollPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestVirtualScrollPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestVirtualScrollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
