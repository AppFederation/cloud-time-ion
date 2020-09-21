import {Dict, dictToArrayWithIds} from "../../../libs/AppFedShared/utils/dictionary-utils";
import {ILateInit} from './JournalNumericDescriptors'
import {SidesDefs} from '../../Learn/core/sidesDefs'
import {FormControl} from '@angular/forms'

/* TODO: split into UiField and simpler UiFieldDecl */
export class UiFieldDef implements ILateInit {

  constructor(
    public id?: string,
    public uiName?: string,
  ) {}

  lateInit() {
    this.uiName = this.uiName || this.id ! . replace(/_/g, ' ')
  }
}



export class JournalTextDescriptor extends UiFieldDef {
}


function d() {
  return new JournalTextDescriptor()
}

export class JournalTextDescriptors {

  static instance = new JournalTextDescriptors()

  general = d()
  positive = d()
  negative = d()

  // group the should*-s ?

  should = d()

  should_do_more = d()
  /** Add psychology hints:  start step by step, don't get overwhelmed */
  should_start_doing = d()
  should_do_less = d()
  /** Add psychology hints: be careful, because often people take extreme vows, like stop drinking whereas moderation might be better */
  should_stop_doing = d()
  should_continue_doing = d()

  predictions = d()

  array = dictToArrayWithIds(this as any as Dict<JournalTextDescriptor>)

}

export type TextDescriptorsFormControlsDict = {[key in keyof JournalTextDescriptors]: FormControl }

