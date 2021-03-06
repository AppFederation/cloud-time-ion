import { TestBed } from '@angular/core/testing';

import { WhatNextService } from './scheduler/what-next.service';

describe('SchedulerService', () => {
  let service: WhatNextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhatNextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
