import { TestBed } from '@angular/core/testing';

import { TimersService } from './timers.service';

describe('TimersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimersService = TestBed.get(TimersService);
    expect(service).toBeTruthy();
  });
});
