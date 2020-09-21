import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {OdmItemId} from "../../../libs/AppFedShared/odm/OdmItemId";
import {OdmInMemItem} from '../../../libs/AppFedShared/odm/OdmItem$2'

export class JournalEntry extends OdmInMemItem /*OdmItem<JournalEntry>*/ {
  constructor(
    // odmService: OdmService<JournalEntry>,
    // id?: OdmItemId<JournalEntry>,
    public text?: string,
    public lastModifiedGeo?: any,
  ) {
    super()
    // super(
    //   odmService,
    //   id,
    // )
  }

  // patchJournalField(fieldId: keyof JournalNumericDescriptors, patch: JournalFieldPatch)
}
