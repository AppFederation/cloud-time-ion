import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import sortBy from 'lodash/sortBy'

export class LearnItem {
  whenAdded: any
  title: string
  isTask?: boolean
}

function field<T>(fieldName: keyof T) {
  return fieldName
}

@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.sass'],
})
export class SearchOrAddLearnableItemPage implements OnInit {

  search: string

  coll = this.angularFirestore.collection<LearnItem>('LearnItem')
  items: LearnItem[]

  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
  ) { }

  ngOnInit() {
    console.log(`this.coll.get()`, this.coll.get())

    this.coll.get().subscribe(items => {
      console.log('items2 items.docs.length', items.docs.length)
    })
    this.coll.valueChanges().subscribe(items => {
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
}
