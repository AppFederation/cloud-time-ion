import {OdmList} from "./OdmList";
import {OdmChildListDefinition} from "./OdmChildListDefinition";
import {OdmChildListBackend} from "./OdmChildListBackend";
import {OdmItem} from "./OdmItem";

export class OdmChildList<
  TChild extends OdmItem<TChild>,
  TParent extends OdmItem<TParent>
  > extends OdmList<TChild>
{

  childListBackend: OdmChildListBackend<TParent, TChild>

  constructor(
    public readonly parentItem: TParent,
    public listDefinition: OdmChildListDefinition<TParent, TChild>
  ) {
    super()
    this.childListBackend = this.listDefinition.obtainBackend(parentItem)
    parentItem.odmService.odmBackendFactory.createManyToManyBackend()
  }

  add(newChild: TChild) {
    this.childListBackend.addInclusionMetaDataToChild(newChild, this.parentItem.id, {})
  }


}
