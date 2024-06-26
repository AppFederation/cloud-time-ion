import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({providedIn: 'root'})
export class DialogService {

  deleteDialog$ = new Subject<any>()

  constructor() { }

  showDeleteDialog(callback: any) {
    this.deleteDialog$.next({callback: callback})
  }

}
