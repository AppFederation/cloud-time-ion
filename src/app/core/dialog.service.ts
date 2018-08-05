import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject'

@Injectable()
export class DialogService {

  deleteDialog$ = new Subject<any>()

  constructor() { }

  showDeleteDialog(callback) {
    this.deleteDialog$.next(callback)
  }

}
