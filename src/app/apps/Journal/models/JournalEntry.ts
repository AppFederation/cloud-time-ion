import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {OdmItemId} from "../../../libs/AppFedShared/odm/OdmItemId";
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {JournalNumericDescriptor, JournalNumericDescriptors} from './JournalNumericDescriptors'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {JournalTextDescriptor, JournalTextDescriptors} from './JournalTextDescriptors'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {isNotNullish} from '../../../libs/AppFedShared/utils/utils'

export type JournalEntryId = OdmItemId<JournalEntry>

/* Or: "metrics" */
export interface JournalCompositeFieldVal {
  numVal: NumericPickerVal
  // later: comments, maybe lastModified etc.
}

export class JournalEntry extends OdmInMemItem /*OdmItem<JournalEntry>*/ {
  constructor(
    // odmService: OdmService<JournalEntry>,
    // id?: OdmItemId<JournalEntry>,
    public text: string | null = null,
    public lastModifiedGeo: any | null = null,
  ) {
    super()
    // super(
    //   odmService,
    //   id,
    // )
  }

  getCompositeField(field: JournalNumericDescriptor): JournalCompositeFieldVal | undefined {
    // console.log(`getCompositeField`)
    // return undefined // {numVal: 999}
    // TODO: is this func too slow or called too many times?
    return (this as any) [field.id !]
  }

  getCompositeFieldNumVal(field: JournalNumericDescriptor): number | undefined {
    const compositeVal = this.getCompositeField(field)
    return compositeVal?.numVal
      ?? (compositeVal as number | undefined) /* compatibility with old */
  }

  getTextFieldVal(field: JournalTextDescriptor): string | nullish {
    return (this as any) [field.id !]
  }

  getPresentCompositeFieldEntries(): [JournalNumericDescriptor, number][] {
    const retArray = [] as Array<[JournalNumericDescriptor, number]>
    for ( let desc of JournalNumericDescriptors.instance.array ) {
      const fieldVal = this.getCompositeFieldNumVal(desc)
      if ( fieldVal !== undefined ) {
        retArray.push([desc, fieldVal])
      }
    }
    return retArray
  }

  getPresentTextFieldEntries(): [JournalTextDescriptor, string][] {
    const retArray = [] as Array<[JournalTextDescriptor, string]>
    for ( let desc of JournalTextDescriptors.instance.array ) {
      const fieldVal = this.getTextFieldVal(desc)
      if ( isNotNullish(fieldVal) ) {
        if ( ((fieldVal?.trim?.()?.length ?? 0) > 0) ) {
          retArray.push([desc, fieldVal!])
        } else {
          // console.log(`fieldVal`, fieldVal)
        }
      }
    }
    return retArray
  }


  // patchJournalField(fieldId: keyof JournalNumericDescriptors, patch: JournalFieldPatch)
}
