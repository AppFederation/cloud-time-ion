import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {LearnItem$} from '../../models/LearnItem$'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {btn, btnVariant, ButtonsDescriptor} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {ImportanceDescriptor, ImportanceDescriptors, importanceDescriptors, importanceDescriptorsArray} from '../../models/fields/importance.model'

export function intensityBtnVariant(label: string, descr: any) {
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
      intensityBtnVariant(`↓`, importanceDescriptors.somewhat_low),
      intensityBtnVariant(`↓ ↓`, importanceDescriptors.low),
      intensityBtnVariant(`↓ ↓ ↓`, importanceDescriptors.very_low),
      intensityBtnVariant(`↓ ↓ ↓ ↓`, importanceDescriptors.extremely_low),
      // inspiration for various kinds of arrows: https://en.wikipedia.org/wiki/Arrow_(symbol)#Arrows_in_Unicode
    ],
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`~`, importanceDescriptors.medium),
      intensityBtnVariant(`?`, importanceDescriptors.unknown),
      intensityBtnVariant(`-`, importanceDescriptors.undefined /* TODO: isUnset: true */),
      // unset is actually no button highlighted and hence no label --> undefined
    ]
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`!`, importanceDescriptors.somewhat_high),
      intensityBtnVariant(`! ! `, importanceDescriptors.high),
      intensityBtnVariant(`! ! !`, importanceDescriptors.very_high),
      intensityBtnVariant(`! ! ! !`, importanceDescriptors.extremely_high),
      // intensityBtnVariant(`X-TEST`, importanceDescriptors.testing_extremely_high),
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

  formGroup ! : FormGroup

  formControls = {
    importance: new FormControl(),
  }

  viewSyncer ! : ViewSyncer

  @Input()
  @Required()
  public item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup(this.formControls)
    this.viewSyncer = new ViewSyncer(
      this.formGroup,
      this.item$,
      false,
      'importance'
    ) /* TODO might need to ignore other fields from db */
  }

}
