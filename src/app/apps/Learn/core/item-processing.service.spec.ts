import { TestBed } from '@angular/core/testing';

import { ItemProcessingService } from './item-processing.service';

describe('ItemProcessingService', () => {
  let service: ItemProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
