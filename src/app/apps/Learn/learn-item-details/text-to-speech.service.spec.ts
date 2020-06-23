import { TestBed } from '@angular/core/testing';

import { TextToSpeechService } from './text-to-speech.service';

describe('TextToSpeechService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextToSpeechService = TestBed.get(TextToSpeechService);
    expect(service).toBeTruthy();
  });
});
