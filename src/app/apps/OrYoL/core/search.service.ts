import { Injectable } from '@angular/core';
import { OryItemsService } from './ory-items.service'
import {
  Observable,
  of,
} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  allItems: any[] = []

  constructor(
    private dataItemsService: OryItemsService
  ) {
    this.dataItemsService.onItemWithDataAdded$.subscribe((item: any) => {
      this.allItems.push(item)
      // console.log('Adding for search', item)
    })
  }

  search(searchString: string) {
    return of(this.allItems.filter(item => {
      const itemData = item.getItemData()
      return itemData && itemData.title && itemData.title.toLowerCase().includes(searchString.toLowerCase())
    }))
  }
}
