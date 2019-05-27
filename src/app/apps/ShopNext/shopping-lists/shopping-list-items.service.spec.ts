import { TestBed } from '@angular/core/testing';

import { ShoppingListItemsService } from './shopping-list-items.service';

describe('ShoppingListItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingListItemsService = TestBed.get(ShoppingListItemsService);
    expect(service).toBeTruthy();
  });
});
