import { TestBed } from '@angular/core/testing';

import { LingueeService } from './linguee.service';

describe('LingueeService', () => {
  let service: LingueeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LingueeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
