import {OdmItem} from "../../../libs/AppFedShared/odm/OdmItem";
import {OdmService} from "../../../libs/AppFedShared/odm/OdmService";
import {OdmItemId} from "../../../libs/AppFedShared/odm/OdmItemId";

export class JournalEntry extends OdmItem<JournalEntry> {
  constructor(
    odmService: OdmService<JournalEntry>,
    id?: OdmItemId<JournalEntry>,
    public text?: string,
    public lastModifiedGeo?: any,
  ) {
    super(
      odmService,
      id,
    )
  }

  // patchJournalField(fieldId: keyof JournalNumericDescriptors, patch: JournalFieldPatch)
}
