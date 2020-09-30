import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore'
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
// import sortBy from 'lodash/sortBy'
import {sortBy, countBy} from 'lodash'
// import countBy from 'lodash/countBy'
import {LearnDoService} from '../core/learn-do.service'
import {sidesDefsArray} from '../core/sidesDefs'
import {field, LearnItem, LearnItemSidesVals} from '../models/LearnItem'
import {splitAndTrim} from '../../../libs/AppFedShared/utils/stringUtils'
import {QuizService} from '../core/quiz.service'
import {AuthService} from '../../../auth/auth.service'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {User} from 'firebase'
import {FormControl} from '@angular/forms'
import {stripHtml} from '../../../libs/AppFedShared/utils/html-utils'
import {debounceTime} from 'rxjs/operators'

@Component({
  selector: 'app-search-or-add-learnable-item',
  templateUrl: './search-or-add-learnable-item.page.html',
  styleUrls: ['./search-or-add-learnable-item.page.scss'],
})
export class SearchOrAddLearnableItemPageComponent implements OnInit {

  search: string = ''
  htmlSearch ? : string = undefined
  searchFormControl = new FormControl()

  coll ! : AngularFirestoreCollection<any>
  items: LearnItem[] = []
  filteredItems: LearnItem[] = []
  private patchingOwnerHasRun = false

  showOldEditor = false


  get authUserId() { return this.authService.authUser$.lastVal?.uid }

  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
    protected learnDoService: LearnDoService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.searchFormControl.valueChanges.pipe(
      debounceTime(100),
    ).subscribe(val => {
      this.htmlSearch = val
      val = stripHtml(val)

      this.search = val
      this.onChangeSearch(val)
    })
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
    this.authService.authUser$.subscribe(user => {
        if ( user ) {
          this.coll = this.angularFirestore.collection</*LearnItem*/ any>('LearnItem'
            , coll => coll.where(`owner`, `==`, user?.uid))
          // /*, coll => coll.where(`whenDeleted`, `==`, null)*/)
          this.coll.valueChanges({idField: 'id'}).subscribe(items => {
            items = items.map(item => Object.assign(new LearnItem(), item))
            this.items = sortBy(items, field<LearnItem>(`whenAdded`)).reverse()

            this.reFilter()

            // this.patchOwnersIfNecessary(user, items)
          })
        }
    })
  }

  private patchOwnersIfNecessary(user: User, items: any[]) {
    debugLog(`patchOwnersIfNecessary:`)

    if ((!this.patchingOwnerHasRun) && (user.uid === `7Tbg0SwakaVoCXHlu1rniHQ6gwz1`)) {
      let count = 0
      for (let item of items) {
        debugLog(`owner`, item.owner)
        if ((!item.owner) || item.owner === `zzzowner` || item.owner === `5cXdqI2HKIYgbqWlJ8Pm372UpcI2`) {
          this.coll.doc(item.id).update({
            owner: user.uid,
          })
          if (count % 10 === 0) {
            debugLog(`patching owner`, count)
          }
          ++count
        }
      }
      this.patchingOwnerHasRun = true
    }
  }

  add(string?: string, isTask?: boolean) {
    console.log('add: ', string)
    string = string || this.htmlSearch || this.search
    if ( !string ) {
      return
    }

    if (! (string || '').trim().length ) {
      return
    }

    const newItem = this.createItemFromInputString(string, isTask)
    if ( newItem ) {
      debugLog(`add item:`, newItem)
      this.syncStatusService.handleSavingPromise(
        this.coll.add(newItem))
      this.clearInput()
    }
  }

  clearInput() {
    this.search = ''
    this.searchFormControl.setValue('')
  }

  createItemFromInputString(string: string, isTask?: boolean) {
    if ( ! string ?. trim() ) {
      return
    }
    const QQ = /<-->|<->|----/ // <> - pascal not-equal
    const QA = /---/ // |-->/ // removed -- because it exists in command line options and html comments
    // --> - end of XML/HTML comment
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
      owner: this.authUserId,
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
  }

  trackByFn(index: number, item: LearnItem) {
    return item.id
  }

  matchesSearch(item: LearnItem) {
    // if ( item.hasQAndA() ) {
    //   return false
    // }
    // strip html: https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
    if ( ! item ) {
      return false
    }
    const search = (this.search || '').trim().toLowerCase()
    if ( search.length === 0 ) {
      return true
    }
    for (let side of sidesDefsArray) {
      const sideVal = item.getSideVal(side)
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
