import {OdmChildListDefinition} from "./OdmChildListDefinition";
import {OdmItem} from "./OdmItem";

export abstract class OdmChildListBackend<
  TParent extends OdmItem<TParent>,
  TChild extends OdmItem<TChild>
  >
{

  constructor(
    public readonly listDefinition: OdmChildListDefinition<TParent, TChild>,
  ) {}

  abstract addInclusionMetaDataToChild(dbItem: TChild, parentId, inclusionMetadata)

}

