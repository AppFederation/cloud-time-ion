import { TestBed } from '@angular/core/testing';

import { FieldDefNumericService } from './field-def-numeric.service';

describe('FieldsNumericService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FieldDefNumericService = TestBed.get(FieldDefNumericService);
    expect(service).toBeTruthy();
  });
});
