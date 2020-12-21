import { TestBed } from '@angular/core/testing';

import { LocalDebugOptionsService } from './local-debug-options.service';

describe('DebugOptionsService', () => {
  let service: LocalDebugOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDebugOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
