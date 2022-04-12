import {Component, Input, OnInit} from '@angular/core';
import {ListOptionsData} from '../list-options'
import {PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.sass'],
})
export class ListOptionsComponent implements OnInit {

  @Required()
  @Input()
  listOptions$P ! : PatchableObservable<ListOptionsData>


  formControls = {
    range: new FormControl(),
    rangeEnabled: new FormControl(true),
  }

  constructor() { }

  ngOnInit() {
    this.formControls.range.valueChanges.subscribe(x => {
      console.log(`this.formControls.range.valueChanges`, x)
    })
  }

  setPreset(preset: string) {
    this.listOptions$P.patchThrottled({
      preset
    })
  }
}
