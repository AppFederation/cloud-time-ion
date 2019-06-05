import { TestBed } from '@angular/core/testing';

import { JournalEntriesService } from './journal-entries.service';

describe('JournalEntriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JournalEntriesService = TestBed.get(JournalEntriesService);
    expect(service).toBeTruthy();
  });
});
