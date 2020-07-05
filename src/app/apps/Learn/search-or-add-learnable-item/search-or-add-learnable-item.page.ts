import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import sortBy from 'lodash/sortBy'
import countBy from 'lodash/countBy'
import {LearnDoService} from '../core/learn-do.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {field, LearnItem, LearnItemSidesVals} from '../models/LearnItem'
import {countNotNullishBy} from '../../../libs/AppFedShared/utils/utils'
import {splitAndTrim} from '../../../libs/AppFedShared/utils/stringUtils'


@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.scss'],
})
export class SearchOrAddLearnableItemPage implements OnInit {

  search: string

  coll = this.angularFirestore.collection</*LearnItem*/ any>('LearnItem'
    /*, coll => coll.where(`whenDeleted`, `==`, null)*/)
  items: LearnItem[]
  filteredItems: LearnItem[]

  public itemsWithRatingCount: number = undefined
  public itemsWithRatingCount2: number

  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
    protected learnDoService: LearnDoService,
  ) { }

  ngOnInit() {
    // this.coll.get().subscribe(items => {
    //   // console.log('get(): items2 items.docs.length', items.docs.length)
    // })

    // this.coll.snapshotChanges().subscribe(items => {
    //   // this.items = items.map(doc => {
    //   //   const documentData = doc.data()
    //   //   documentData.id = doc.id
    //   //   return documentData as LearnItem
    //   // })
    //   // this.items = sortBy(this.items, field<LearnItem>(`whenAdded`)).reverse()
    //   // console.log(`snapshotChanges`, items.length)
    // })

    this.coll.valueChanges({idField: 'id'}).subscribe(items => {
      items = items.map(item => Object.assign(new LearnItem(), item))
      this.items = sortBy(items, field<LearnItem>(`whenAdded`)).reverse()

      this.itemsWithRatingCount = countBy(this.items, (item: LearnItem) => item.lastSelfRating)
      this.itemsWithRatingCount2 = countNotNullishBy(this.items, item => item.lastSelfRating)
      this.reFilter()
    })

  }

  add(string?: string, isTask?: boolean) {
    console.log('add: ', string)
    string = string || this.search
    if ( !string ) {
      return
    }

    if (! (string || '').trim().length ) {
      return
    }

    const newItem = this.createItemFromInputString(string, isTask)
    if ( newItem ) {
      this.syncStatusService.handleSavingPromise(
        this.coll.add(newItem))
      this.clearInput()
    }
  }

  clearInput() {
    this.search = ''
  }

  createItemFromInputString(string: string, isTask: boolean) {
    if ( ! string ?. trim() ) {
      return
    }
    const QQ = /<-->|<->|<>/
    const QA = /--|-->/
    const overlay: Partial<LearnItemSidesVals> = {}
    if ( string.match(QQ) ) {
      const split = splitAndTrim(string, QQ)
      overlay.question = split[0]
      overlay.question2 = split[1]
      if ( split[2] ) {
        overlay.question3 = split[2]
      }
    } else if ( string.match(QA) ) {
      const split = splitAndTrim(string, QA)
      overlay.question = split[0]
      overlay.answer = split[1]
      if ( split[2] ) {
        overlay.question2 = split[2]
      }
      if ( split[3] ) {
        overlay.question3 = split[3]
      }
    } else {
      overlay.title = (string || '')./*?.*/trim() /*?? null*/
    }
    return Object.assign({
      whenAdded: new Date(),
      isTask: isTask ? true : null,
    }, overlay)
  }

  addTask() {
    this.add(undefined, true)
  }

  addToLearn() {
    this.add(undefined, false)
  }

  @HostListener('window:keyup.alt.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(`alt enter`)
    // window.alert('winkeup')
  }

  trackByFn(index: number, item: LearnItem) {
    return item.id
  }

  matchesSearch(item: LearnItem) {
    if ( ! item ) {
      return false
    }
    const search = (this.search || '').trim().toLowerCase()
    if ( search.length === 0 ) {
      return true
    }
    for (let side of sidesDefsArray) {
      const sideVal = item[side.id]
      if ( sideVal && sideVal.toLowerCase().includes(search) ) {
        return true
      }
    }
    return false
  }

  onChangeSearch($event: string) {
    this.reFilter()
  }

  private reFilter() {
    this.filteredItems = this.items.filter(item => this.matchesSearch(item))
  }

  hasSearchText() {
    return !! this.search?.trim();
  }
}
