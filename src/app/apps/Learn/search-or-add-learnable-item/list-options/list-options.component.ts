import {Component, Input, OnInit} from '@angular/core';
import {LocalOptionsPatchableObservable} from '../../core/options.service'
import {ListOptionsData} from '../list-options'
import {PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.sass'],
})
export class ListOptionsComponent implements OnInit {

  @Required()
  @Input()
  listOptions$P ! : PatchableObservable<ListOptionsData>

  constructor() { }

  ngOnInit() {}

  setPreset(preset: string) {
    this.listOptions$P.patchThrottled({
      preset
    })
  }
}
