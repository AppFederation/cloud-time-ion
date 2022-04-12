import { Injectable } from '@angular/core';
import {OdmItem$2} from '../libs/AppFedShared/odm/OdmItem$2'
import {ActivatedRoute, Router} from '@angular/router'
import {ItemId} from '../libs/AppFedShared/odm/OdmCollectionBackend'
import {CachedSubject} from '../libs/AppFedShared/utils/cachedSubject2/CachedSubject2'

class NavigationStatus {

  get percent() {
    if ( ! this.totalCount ) {
      return 0
    }
    return ((this.currentOrdinal / this.totalCount) * 100)?.toFixed(1)
  }

  constructor(
    public currentOrdinal: number,
    public totalCount: number,
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  list ? : Array<OdmItem$2<any, any, any, any>>

  status$ = new CachedSubject<NavigationStatus>(
    new NavigationStatus(0, 0)
  )

  currentItemId ?: any

  nextItemId ? : ItemId
  prevItemId ? : ItemId

  // get currentItemId() {
  //   return this.currentItemId
  // }

  constructor(
    // protected route: ActivatedRoute,
    protected router: Router,
  ) {

  }

  setCurrenItemId(id: any) {
    this.currentItemId = id
    if ( ! this.list ) {
      return
    }
    const currentIndex = this.list!.findIndex(item$ => item$.id === this.currentItemId)

    this.prevItemId = this.list![currentIndex - 1]?.id as ItemId
    this.nextItemId = this.list![currentIndex + 1]?.id as ItemId

    this.status$.nextWithCache(new NavigationStatus(currentIndex + 1, this.list?.length ?? 0))
  }

  public navigateToNext() {
    this.navToId(this.nextItemId)
    // this.navToOffset(+1)
  }

  public navigateToPrevious() {
    this.navToId(this.prevItemId)
    // this.navToOffset(-1)
  }

  // public getItemId() {
  //   // return this.router.routerState.snapshot..params['itemId']
  //   const href = window.location.href
  //   return href.substr(window.location.href.lastIndexOf('/') + 1)
  // }
  //
  // /* DEPRECATED, coz we now store next & prev ide-s upon navigating, to support a case of sequential items editing,
  //  in which item is modified and moved in the list */
  // public navToOffset(offset: number) {
  //   const currentId = this.getItemId()
  //   console.log('currentId', currentId )
  //   const currentIndex = this.list!.findIndex(item$ => item$.id === currentId)
  //   const newItem = this.list![currentIndex + offset]
  //   const newId = newItem?.id as ItemId
  //   this.navToId(newId)
  // }

  public navToId(newId ? : ItemId) {
    console.log('navToId newId ', newId)
    if (newId) {
      this.router.navigateByUrl('learn/item/' + newId)
    }
  }
}
