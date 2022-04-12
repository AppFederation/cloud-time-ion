import {Component, Input, OnInit} from '@angular/core';
import {mentalEffortLevels} from '../../models/fields/mental-effort-level.model'
import {btn, ButtonsDescriptor} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {intensityBtnVariant} from '../../../../libs/LifeSuiteShared/edit-shared/importance-edit/importance-edit.component'
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {LearnItem$} from '../../models/LearnItem$'

const levels = mentalEffortLevels

const buttonsDesc = new ButtonsDescriptor<any, string>([
  btn({
    btnVariants: [
      intensityBtnVariant(`🤒`, levels.somewhat_low),
      intensityBtnVariant(`🤒🤒`, levels.low),
      intensityBtnVariant(`🤒🤒🤒`, levels.very_low),
      intensityBtnVariant(`🤒🤒🤒🤒`, levels.extremely_low),
      // inspiration for various kinds of arrows: https://en.wikipedia.org/wiki/Arrow_(symbol)#Arrows_in_Unicode
    ],
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`~`, levels.medium),
      intensityBtnVariant(`?`, levels.unknown),
      intensityBtnVariant(`-`, levels.undefined /* TODO: isUnset: true */),
      // unset is actually no button highlighted and hence no label --> undefined
    ]
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`🤸`, levels.somewhat_high),
      intensityBtnVariant(`🤸🤸`, levels.high),
      intensityBtnVariant(`🤸🤸🤸`, levels.very_high),
      intensityBtnVariant(`🤸🤸🤸🤸`, levels.extremely_high),
      // intensityBtnVariant(`X-T-Mental`, levels.testing_extremely_high),
    ]
  }),
])

@Component({
  selector: 'app-physical-health-impact-level-edit',
  templateUrl: './physical-health-impact-level-edit.component.html',
  styleUrls: ['./physical-health-impact-level-edit.component.sass'],
})
export class PhysicalHealthImpactLevelEditComponent implements OnInit {


  readonly fieldName = 'physicalHealthImpact'

  buttonsDesc = buttonsDesc

  formGroup ! : FormGroup

  formControls = {
    physicalHealthImpact: new FormControl(),
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
      this.fieldName
    )
  }

}
