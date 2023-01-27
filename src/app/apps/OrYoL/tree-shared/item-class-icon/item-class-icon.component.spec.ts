import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemClassIconComponent } from './item-class-icon.component';

describe('ItemClassIconComponent', () => {
  let component: ItemClassIconComponent;
  let fixture: ComponentFixture<ItemClassIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemClassIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemClassIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
