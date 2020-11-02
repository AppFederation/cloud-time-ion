import { TestBed } from '@angular/core/testing';

import { LangsService } from './langs.service';

describe('LangsService', () => {
  let service: LangsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
