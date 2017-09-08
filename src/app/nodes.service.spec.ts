import { TestBed, inject } from '@angular/core/testing';

import { NodesService } from './nodes.service';

describe('NodesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodesService]
    });
  });

  it('should be created', inject([NodesService], (service: NodesService) => {
    expect(service).toBeTruthy();
  }));
});
