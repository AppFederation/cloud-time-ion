import {Query} from "@angular/fire/firestore";
import {OdmChildListBackend} from "../../AppFedShared/odm/OdmChildListBackend";
import {OdmItem} from "../../AppFedShared/odm/OdmItem";

export class OdmFirestoreManyToManyChildListBackend<
  TParent extends OdmItem<TParent>,
  TChild extends OdmItem<TChild>
  >
  extends OdmChildListBackend<TParent, TChild>
{

  addInclusionMetaDataToChild(child: TChild, parentId, inclusionMetadata) {
    let inclusionFieldVal = child[this.listDefinition.opts.inclusionsFieldNameInChild];
    if ( ! inclusionFieldVal ) {
      inclusionFieldVal = {}
      child[this.listDefinition.opts.inclusionsFieldNameInChild] = inclusionFieldVal
    }
    inclusionFieldVal[parentId] = {
      included: true,
      whenCreated: new Date(),
      inclusion: inclusionMetadata,
    }
  }

  addQueryParam(query: Query, parentId) {
    // return query.where(`${this.inclusionFieldName}.${parentId}.included`, '==', true)
  }

}
