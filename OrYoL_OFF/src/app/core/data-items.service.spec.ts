import { TestBed } from '@angular/core/testing';

import { DataItemsService } from './data-items.service';

describe('DataItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataItemsService = TestBed.get(DataItemsService);
    expect(service).toBeTruthy();
  });
});
