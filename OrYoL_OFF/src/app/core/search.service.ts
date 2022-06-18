import { Injectable } from '@angular/core';
import { DataItemsService } from './data-items.service'
import {
  Observable,
  of,
} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  allItems = []

  constructor(
    private dataItemsService: DataItemsService
  ) {
    this.dataItemsService.onItemWithDataAdded$.subscribe(item => {
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
