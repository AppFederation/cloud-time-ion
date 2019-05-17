import { TestBed } from '@angular/core/testing';

import {AudioService} from "./audio.service";

describe('AudioService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AudioService]
  }));

  it('should be created', () => {
    const service = TestBed.get(AudioService);
    expect(service).toBeTruthy();
  });
});
