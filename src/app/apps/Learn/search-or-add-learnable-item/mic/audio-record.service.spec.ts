import { TestBed } from '@angular/core/testing';

import { AudioRecordService } from './audio-record.service';

describe('AudioRecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioRecordService = TestBed.get(AudioRecordService);
    expect(service).toBeTruthy();
  });
});
