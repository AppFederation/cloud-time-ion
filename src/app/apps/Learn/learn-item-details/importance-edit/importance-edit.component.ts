import {Component, Input, OnInit} from '@angular/core';
import {ImportanceDescriptor, ImportanceDescriptors, importanceDescriptors, importanceDescriptorsArray, LearnItem} from '../../models/LearnItem'
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {SideFormControlsDict} from '../../shared/item-side/item-side.component'
import {LearnItem$} from '../../models/LearnItem$'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {btn, btnVariant, ButtonsDescriptor} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'

function impBtnVariant(label: string, descr: ImportanceDescriptor) {
  return btnVariant({
    value: descr /* FIXME*/,
    label: label,
    subLabel: descr.id.replace(`_`, ` `),
    id: descr.id,
  })
}

const importanceButtonsDesc = new ButtonsDescriptor<any, string>([
  btn({
    btnVariants: [
      impBtnVariant(`↓`, importanceDescriptors.somewhat_low),
      impBtnVariant(`↓ ↓`, importanceDescriptors.low),
      impBtnVariant(`↓ ↓ ↓`, importanceDescriptors.very_low),
      impBtnVariant(`↓ ↓ ↓ ↓`, importanceDescriptors.extremely_low),
      // inspiration for various kinds of arrows: https://en.wikipedia.org/wiki/Arrow_(symbol)#Arrows_in_Unicode
    ],
  }),
  btn({
    btnVariants: [
      impBtnVariant(`~`, importanceDescriptors.medium),
      impBtnVariant(`?`, importanceDescriptors.unknown),
      // unset is actually no button highlighted and hence no label
      // btnVariant({
      //   value: importanceDescriptors.unknown,
      //   label: `-`,
      //   id: importanceDescriptors.medium
      // }),
    ]
  }),
  btn({
    btnVariants: [
      impBtnVariant(`!`, importanceDescriptors.somewhat_high),
      impBtnVariant(`! ! `, importanceDescriptors.high),
      impBtnVariant(`! ! !`, importanceDescriptors.very_high),
      impBtnVariant(`! ! ! !`, importanceDescriptors.extremely_high),
      impBtnVariant(`X-TEST`, importanceDescriptors.testing_extremely_high),
    ]
  }),
])


@Component({
  selector: 'app-importance-edit',
  templateUrl: './importance-edit.component.html',
  styleUrls: ['./importance.component.sass'],
})
export class ImportanceEditComponent implements OnInit {

  importanceButtonsDesc = importanceButtonsDesc

  importanceDescriptorsArray = importanceDescriptorsArray

  formGroup ! : FormGroup

  formControls = {
    importance: new FormControl(),
  }

  viewSyncer ! : ViewSyncer

  @Input() @Required()
  public item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(this.formGroup, this.item$, false, 'importance') /* TODO might need to ignore other fields from db */
    // const origPatchFn = this.item$.patchThrottled
    // this.item$.patchThrottled = function() {
    //   console.log(`importance patchThrottled args `, arguments)
    //   // origPatchFn()
    // }

  }

}
