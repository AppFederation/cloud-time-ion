import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../AppFedShared/odm/ui/ViewSyncer'
import {btn, btnVariant, ButtonsDescriptor} from '../../../AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {intensityBtnVariant} from '../importance-edit/importance-edit.component'
import {LearnItem$} from '../../../../apps/Learn/models/LearnItem$'
import {funLevels} from '../../../../apps/Learn/models/fields/fun-level.model'


const levels = funLevels

const buttonsDesc = new ButtonsDescriptor<any, string>([
  btn({
    btnVariants: [
      intensityBtnVariant(`😡` /*😒*/, levels.somewhat_low),
      intensityBtnVariant(`😡😡`, levels.low),
      intensityBtnVariant(`😡😡😡`, levels.very_low),
      intensityBtnVariant(`😡😡😡😡`, levels.extremely_low),
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
      intensityBtnVariant(`😊`, levels.somewhat_high),
      intensityBtnVariant(`😊😊`, levels.high),
      intensityBtnVariant(`😊😊😊`, levels.very_high),
      intensityBtnVariant(`😊😊😊😊`, levels.extremely_high),

      // intensityBtnVariant(`X-T-Fun`, levels.testing_extremely_high),
    ]
  }),
])


@Component({
  selector: 'app-fun-level-edit',
  templateUrl: './fun-level-edit.component.html',
  styleUrls: ['./fun-level-edit.component.sass'],
})
export class FunLevelEditComponent implements OnInit {

  @Input() formControl1 ! : FormControl

  buttonsDesc = buttonsDesc

  formGroup ! : FormGroup

  formControls = {
    /* or funEstimate ? ;;; later there can be field for actual fun (could be lower or higher or equal) */
    funEstimate: new FormControl(),
  }

  viewSyncer ! : ViewSyncer

  @Input()
  // @Required()
  public item$ ! : LearnItem$

  constructor() { }

  ngOnInit() {
    if ( this.formControl1 ) {
      // can use logical assignment operator to overwrite &&=  /  ||=  /  ??=
      // https://www.typescriptlang.org/play#code/C4TwDgpgBAQg9nANlAvFARgxECGA7KAHyjwFdFljS8ATCAMwEs8IaBuAWAChvtgoAHgC5YWVFGAAnUhE48uAqADIlaejkQBnWVAD0u1AD4o6rRG6KVaMhTZ6DKYzcQXlqqNTpMW7e0Y+0DMys3LwQ-CAi8Ejiptpy3CBuaFIydvr+ceZcSVYk5IjpDsZZickBXsG+GY4mGtrcQA
      this.formControls.funEstimate = this.formControl1
    }
    this.formGroup = new FormGroup(this.formControls)
    if ( this . item$ ) {
      this.viewSyncer = new ViewSyncer(
        this.formGroup,
        this.item$,
        false,
        'funEstimate'
      ) /* TODO might need to ignore other fields from db */
    }
  }

}
