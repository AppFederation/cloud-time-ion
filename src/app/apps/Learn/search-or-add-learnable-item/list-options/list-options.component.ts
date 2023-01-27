import {Component, Input, OnInit} from '@angular/core';
import {ListOptionsData} from '../list-options'
import {PatchableObservable} from '../../../../libs/AppFedShared/utils/rxUtils'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {FormControl} from '@angular/forms'
import {FeatureService} from '../../../../libs/AppFedShared/feature.service'
import {BaseComponent} from '../../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-list-options',
  templateUrl: './list-options.component.html',
  styleUrls: ['./list-options.component.sass'],
})
export class ListOptionsComponent extends BaseComponent implements OnInit {

  @Required()
  @Input()
  listOptions$P ! : PatchableObservable<ListOptionsData>


  formControls = {
    range: new FormControl(),
    rangeEnabled: new FormControl(true),
  }

  features = this.featureService

  // /** idea for global stuff without having to add services to constructor all the time a million times
  //  * keep names super short, the more popular smth is */
  // g = {
  //   // options / preferences
  //   feat: this.features
  // }

  constructor(
    public featureService: FeatureService,
  ) {
    super(/* prolly will need to pass injector */)
  }

  ngOnInit() {
    this.formControls.range.valueChanges.subscribe(x => {
      console.log(`this.formControls.range.valueChanges`, x)
    })
  }

  /** I could rewrite this settings + persistence stuff in e.g. mobxState tree */
  setPreset(preset: string) {
    this.listOptions$P.patchThrottled({
      preset
    })
  }
}
