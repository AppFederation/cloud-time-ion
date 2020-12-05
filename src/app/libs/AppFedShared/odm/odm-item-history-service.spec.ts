import { TestBed } from '@angular/core/testing';

import { OdmItemHistoryService } from './odm-item-history-service';

describe('OdmItemHistoryServiceService', () => {
  let service: OdmItemHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdmItemHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
