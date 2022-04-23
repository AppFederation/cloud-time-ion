import { TestBed } from '@angular/core/testing';

import { CellNavigationService } from './cell-navigation.service';

describe('CellNavigationService', () => {
  let service: CellNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CellNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
