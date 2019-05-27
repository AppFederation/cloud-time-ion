import {OdmChildList} from "./OdmChildList";
import {OdmChildListBackend} from "./OdmChildListBackend";
import {OdmItem} from "./OdmItem";

export class OdmChildListDefinitionOptions {
  constructor(
    public readonly inclusionsFieldNameInParent,
    public readonly inclusionsFieldNameInChild,
  ) {}

}

/** Many-to-many association definition */
export class OdmChildListDefinition<
  TParent extends OdmItem<TParent>,
  TChild extends OdmItem<TChild>
  > {

  childListBackend: OdmChildListBackend<TParent, TChild>

  constructor(
    public readonly opts: OdmChildListDefinitionOptions,
  ) {}


  createChildrenListForParent(parentItem: TParent) {
    return new OdmChildList<TChild, TParent>(parentItem, this)
  }

  obtainBackend(item: TParent) {
    if ( ! this.childListBackend ) {
      this.childListBackend = item.odmService.odmBackendFactory.createManyToManyBackend(this)
    }
    return this.childListBackend
  }
}
