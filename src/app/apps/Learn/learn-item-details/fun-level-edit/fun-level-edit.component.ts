import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {LearnItem$} from '../../models/LearnItem$'
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {btn, btnVariant, ButtonsDescriptor} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {FunLevelDescriptor, funLevels, funLevelsDescriptors} from '../../models/fields/fun-level.model'
import {intensityBtnVariant} from '../importance-edit/importance-edit.component'


const levels = funLevels

const buttonsDesc = new ButtonsDescriptor<any, string>([
  btn({
    btnVariants: [
      intensityBtnVariant(`😒`, levels.somewhat_low),
      intensityBtnVariant(`😒😒`, levels.low),
      intensityBtnVariant(`😒😒😒`, levels.very_low),
      intensityBtnVariant(`😒😒😒😒`, levels.extremely_low),
      // inspiration for various kinds of arrows: https://en.wikipedia.org/wiki/Arrow_(symbol)#Arrows_in_Unicode
    ],
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`~`, levels.medium),
      intensityBtnVariant(`?`, levels.unknown),
      // unset is actually no button highlighted and hence no label --> undefined
    ]
  }),
  btn({
    btnVariants: [
      intensityBtnVariant(`😊`, levels.somewhat_high),
      intensityBtnVariant(`😊😊`, levels.high),
      intensityBtnVariant(`😊😊😊`, levels.very_high),
      intensityBtnVariant(`😊😊😊😊`, levels.extremely_high),
      intensityBtnVariant(`X-T-Fun`, levels.testing_extremely_high),
    ]
  }),
])


@Component({
  selector: 'app-fun-level-edit',
  templateUrl: './fun-level-edit.component.html',
  styleUrls: ['./fun-level-edit.component.sass'],
})
export class FunLevelEditComponent implements OnInit {

  buttonsDesc = buttonsDesc

  formGroup ! : FormGroup

  formControls = {
    /* or funEstimate ? ;;; later there can be field for actual fun (could be lower or higher or equal) */
    funEstimate: new FormControl(),
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
      'funEstimate'
    ) /* TODO might need to ignore other fields from db */
  }

}
