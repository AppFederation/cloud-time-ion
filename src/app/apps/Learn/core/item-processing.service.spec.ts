import { TestBed } from '@angular/core/testing';

import { ItemProcessingService } from './item-processing.service';
import {LearnDoService} from './learn-do.service'

fdescribe('ItemProcessingService', () => {
  let service: ItemProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LearnDoService, useClass: LearnDoService }
      ],
    });
    service = TestBed.inject(ItemProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('works before items are loaded', () => {
    expect(service).toBeTruthy();
  });
});
