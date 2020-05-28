import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchOrAddLearnableItemPage } from './search-or-add-learnable-item.page';

describe('SearchOrAddLearnableItemPage', () => {
  let component: SearchOrAddLearnableItemPage;
  let fixture: ComponentFixture<SearchOrAddLearnableItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchOrAddLearnableItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrAddLearnableItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
