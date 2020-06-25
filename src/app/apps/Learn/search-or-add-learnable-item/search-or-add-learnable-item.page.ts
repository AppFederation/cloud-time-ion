import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import sortBy from 'lodash/sortBy'
import {LearnDoService} from '../core/learn-do.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {field, LearnItem} from '../models/LearnItem'


@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.sass'],
})
export class SearchOrAddLearnableItemPage implements OnInit {

  search: string

  coll = this.angularFirestore.collection</*LearnItem*/ any>('LearnItem'
    /*, coll => coll.where(`whenDeleted`, `==`, null)*/)
  items: LearnItem[]

  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
    protected learnDoService: LearnDoService,
  ) { }

  ngOnInit() {
    console.log(`this.coll.get()`, this.coll.get())

    this.coll.get().subscribe(items => {
      console.log('get(): items2 items.docs.length', items.docs.length)
    })

    this.coll.snapshotChanges().subscribe(items => {
      // this.items = items.map(doc => {
      //   const documentData = doc.data()
      //   documentData.id = doc.id
      //   return documentData as LearnItem
      // })
      // this.items = sortBy(this.items, field<LearnItem>(`whenAdded`)).reverse()
      console.log(`snapshotChanges`, items.length)
    })

    this.coll.valueChanges({idField: 'id'}).subscribe(items => {
      this.items = sortBy(items, field<LearnItem>(`whenAdded`)).reverse()
      console.log('items', items.length)
    })

    // for ( let txt of ().split('\n').map(item => {/*console.log('item map',item)*/; return (item || '').trim()})
    //   ) {
    //   // this.add(txt)
    // }
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

    this.syncStatusService.handleSavingPromise(
      this.coll.add({
        title: (string || '')./*?.*/trim() /*?? null*/,
        whenAdded: new Date(),
        isTask: isTask ? true : null
    }))

    this.search = ''

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
}
