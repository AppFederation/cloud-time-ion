import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemClassIconComponent } from './item-class-icon.component';

describe('ItemClassIconComponent', () => {
  let component: ItemClassIconComponent;
  let fixture: ComponentFixture<ItemClassIconComponent>;

  beforeEach(async(() => {
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
