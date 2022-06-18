import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultRowComponent } from './search-result-row.component';

describe('SearchResultRowComponent', () => {
  let component: SearchResultRowComponent;
  let fixture: ComponentFixture<SearchResultRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
