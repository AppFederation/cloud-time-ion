import {Dict, dictToArrayWithIds} from "../../../libs/AppFedShared/utils/dictionary-utils";
import {ILateInit} from './JournalNumericDescriptors'
import {SidesDefs} from '../../Learn/core/sidesDefs'
import {FormControl} from '@angular/forms'

/* TODO: split into UiField and simpler UiFieldDecl */
export class UiFieldDef implements ILateInit {

  get title() {
    return this.uiName
  }

  constructor(
    public id?: string,
    public uiName?: string,
    public iconName? : string,
  ) {}

  lateInit() {
    this.uiName = this.uiName || this.id ! . replace(/_/g, ' ')
  }
}



export class JournalTextDescriptor extends UiFieldDef {
}


function d(arg?: any) {
  const descriptor = new JournalTextDescriptor()
  descriptor.iconName = arg?.icon
  return descriptor
}

export class JournalTextDescriptors {

  static instance = new JournalTextDescriptors()

  general = d()
  positive = d({
    icon: `thumbs-up-outline`
  })
  negative = d({
    icon: `thumbs-down-outline`
  })

  // group the should*-s ?

  should = d()

  should_do_more = d({
    icon: `arrow-up-circle-outline`
  })
  /** Add psychology hints:  start step by step, don't get overwhelmed */
  should_start_doing = d({icon: `play-outline`})
  should_do_less = d({
    icon: `arrow-down-circle-outline`
  })
  /** Add psychology hints: be careful, because often people take extreme vows, like stop drinking whereas moderation might be better */
  should_stop_doing = d({
    icon: `stop-circle-outline`
  })
  should_continue_doing = d()

  assumptions = d()
  predictions = d()
  goals = d()
  wishes = d()
  hopes = d()

  array = dictToArrayWithIds(this as any as Dict<JournalTextDescriptor>)

}

export type TextDescriptorsFormControlsDict = {[key in keyof JournalTextDescriptors]: FormControl }

