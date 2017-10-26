import { TestBed, inject } from '@angular/core/testing';

import { FirestoreTreeService } from './firestore-tree.service';

describe('FirestoreTreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreTreeService]
    });
  });

  it('should be created', inject([FirestoreTreeService], (service: FirestoreTreeService) => {
    expect(service).toBeTruthy();
  }));
});
