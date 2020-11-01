import { TestBed } from '@angular/core/testing';

import { MerriamWebsterDictService } from './merriam-webster-dict.service';

describe('MerriamWebsterDictService', () => {
  let service: MerriamWebsterDictService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerriamWebsterDictService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
