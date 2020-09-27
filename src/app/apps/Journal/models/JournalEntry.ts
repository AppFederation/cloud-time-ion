import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {OdmItemId} from "../../../libs/AppFedShared/odm/OdmItemId";
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'
import {JournalNumericDescriptor} from './JournalNumericDescriptors'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {JournalTextDescriptor} from './JournalTextDescriptors'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'

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

  // patchJournalField(fieldId: keyof JournalNumericDescriptors, patch: JournalFieldPatch)
}
