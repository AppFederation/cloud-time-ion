import { Injectable } from '@angular/core';
import { NavigationService } from './navigation.service'
import {Subject} from 'rxjs'
import {Dict, mapFields} from '../../../libs/AppFedShared/utils/dictionary-utils'

export type Command = string

// function actions(x: Dict<{}>) {
//   return mapFields(x, (key, val) => {
//
//   })
// }

@Injectable({providedIn: 'root'})
export class CommandsService {

  commands$ = new Subject<Command>()

  // actions = actions({
  //   indentLeft: {}
  // })

  constructor(
    private navigationService: NavigationService,
  ) { }

  // TODO: those should be actions on ngrx store

  reorderUp() {
    this.commands$.next('reorderUp')
  }

  reorderDown() {
    this.commands$.next('reorderDown')
  }

  indentLeft() {
    this.commands$.next('indentLeft')
  }

  indentRight() {
    this.commands$.next('indentRight')
  }


  toggleDone() {
    this.commands$.next('toggleDone')
  }

  planToday() {
    // navigate to last child of Day Plans node - 'item_35023937-195c-4b9c-b265-5e8a01cf397e'
    // this.navigationService.navigateToNodeLastChild('item_35023937-195c-4b9c-b265-5e8a01cf397e')
  }

}
