import { TestBed } from '@angular/core/testing';

import { ShoppingListsService } from './shopping-lists.service';

describe('ShoppingListsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingListsService = TestBed.get(ShoppingListsService);
    expect(service).toBeTruthy();
  });
});
