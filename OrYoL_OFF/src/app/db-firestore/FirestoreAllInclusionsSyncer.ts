// import * as firebase from 'firebase'
import { firestore } from 'firebase'
import DocumentReference = firestore.DocumentReference
import DocumentSnapshot = firestore.DocumentSnapshot

import DocumentChange = firestore.DocumentChange
import {
  debugLog,
  FIXME,
} from '../utils/log'
import QuerySnapshot = firestore.QuerySnapshot
import { NodeInclusion } from '../tree-model/TreeListener'
import {
  FirestoreNodeInclusion,
  FirestoreTreeService,
} from './firestore-tree.service'
import { ChildrenChangesEvent } from '../tree-model/children-changes-event'
import {
  observable,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs'
import { MultiMap } from '../utils/multi-map'

class InclusionsValueAndCallbacks {
  /* Used as initial value if someone subscribes */
  mapByInclusionId = new Map<string, DocumentSnapshot>()
  observables: Subject<ChildrenChangesEvent>[] = []
}

const EMPTY_MAP = new Map<any, any>()

export class FirestoreAllInclusionsSyncer {

  mapParentIdToChildInclusions = new Map<string, InclusionsValueAndCallbacks>()

  private INCLUSIONS_COLLECTION = this.dbPrefix + '_inclusions'

  constructor(
    private db: firebase.firestore.Firestore,
    private dbPrefix: string,
  ) {

  }

  private inclusionsCollection(): firebase.firestore.CollectionReference {
    return this.db.collection(this.INCLUSIONS_COLLECTION)
  }

  startQuery() {
    this.inclusionsCollection().onSnapshot((snapshot: QuerySnapshot) => {
      // TODO: check again regarding offline/metadata: https://firebase.google.com/docs/firestore/query-data/listen
      const mapParentIdToDocsModified = new MultiMap<string, DocumentSnapshot>()
      const mapParentIdToDocsAdded = new MultiMap<string, DocumentSnapshot>()
      // NOTE: for now treating adding and modifying as same event (as in tree event add-or-modify)
      snapshot.docChanges().forEach((change: DocumentChange) => {
        const docSnapshot = change.doc
        const docData = docSnapshot.data() as FirestoreNodeInclusion
        debugLog('FirestoreAllInclusionsSyncer onSnapshot id', change.doc.id, 'DocumentChange', change)
        const parentNodeId = docData.parentNode.id
        if (change.type === 'added') {
          mapParentIdToDocsAdded.add(parentNodeId, docSnapshot)
          // this.putItemAndFireCallbacks(docSnapshot)
        } else if ( change.type === 'modified') {
          debugLog('FirestoreAllItemsLoader modified: ', parentNodeId);
          mapParentIdToDocsModified.add(parentNodeId, docSnapshot)
          // listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
        } else if (change.type === 'removed') {
          FIXME('FirestoreAllItemsLoader change.type === \'removed\'', change)
          // debugLog('Removed, nodeInclusionData: ', nodeInclusionData);
        }
      })
      // in the future I might wanna fire added and modified in single event
      mapParentIdToDocsAdded.map.forEach((inclusions, parentId) => {
        this.putInclusionsForParentAndFireEvent(parentId, inclusions, 'added')
      })
      mapParentIdToDocsModified.map.forEach((inclusions, parentId) => {
        this.putInclusionsForParentAndFireEvent(parentId, inclusions, 'modified')
      })
    })
  }

  getChildInclusionsForParentItem$(parentItemId: string) {
    const inclusionsEntry = this.obtainInclusionsEntryForParentId(parentItemId)
    const newObs = new ReplaySubject<ChildrenChangesEvent>() /* HACK so that the subscriber gets what they need
     * instead I should investigate if it is possible to make a custom observable which emits something (initial value of inclusions map) to the new subscriber only while not emitting it to others.
     * Current impl. makes it so that, you should only subscribe once to a given observable returned (second subscriber will not get the initial value) */
    inclusionsEntry.observables.push(newObs)
    newObs.next(new ChildrenChangesEvent(inclusionsEntry.mapByInclusionId, EMPTY_MAP))
    return newObs
    FIXME('getChildInclusionsForParentItem$')
  }

  addNodeInclusionToParent(
      nodeInclusion: NodeInclusion,
      parentId: string,
      parentDoc: DocumentReference,
      nodeInclusionFirebaseObject: FirestoreNodeInclusion
  ) {
    nodeInclusionFirebaseObject.parentNode = parentDoc
    this.docByInclusionId(nodeInclusion.nodeInclusionId).set(nodeInclusionFirebaseObject)
  }


  private docByInclusionId(nodeInclusionId: string) {
    return this.inclusionsCollection().doc(nodeInclusionId)
  }

  private putInclusionsForParentAndFireEvent(parentId: string, inclusions: DocumentSnapshot[], eventType: 'added' | 'modified') {
    const addedOrModifiedInclusionsMap = this.arrayToMapById(inclusions)
    let inclusionsValueAndCallbacks = this.obtainInclusionsEntryForParentId(parentId)
    inclusions.forEach(inclusion => {
      inclusionsValueAndCallbacks.mapByInclusionId.set(inclusion.id, inclusion)
    })
    inclusionsValueAndCallbacks.observables.forEach(subject => {
      subject.next(new ChildrenChangesEvent(
        eventType === 'added' ? addedOrModifiedInclusionsMap : EMPTY_MAP, /* note: only fire with the currently modified, not all already present!*/
        eventType === 'modified' ? addedOrModifiedInclusionsMap : EMPTY_MAP,
      ))
    })
  }

  private obtainInclusionsEntryForParentId(parentId: string) {
    let inclusionsValueAndCallbacks = this.mapParentIdToChildInclusions.get(parentId)
    if (!inclusionsValueAndCallbacks) {
      inclusionsValueAndCallbacks = new InclusionsValueAndCallbacks()
      this.mapParentIdToChildInclusions.set(parentId, inclusionsValueAndCallbacks)
    }
    return inclusionsValueAndCallbacks
  }

  private arrayToMapById(inclusions: DocumentSnapshot[]) {
    const arrayToMapById = new Map<string, DocumentSnapshot>()
    inclusions.forEach(inclusion => {
      arrayToMapById.set(inclusion.id, inclusion)
    })
    return arrayToMapById
  }

  patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any) {
    this.docByInclusionId(itemInclusionId).update(itemInclusionData)
  }

  // patchChildInclusionDataWithNewParent(itemInclusionId: string, newParentItem: DocumentReference) {
  //   this.docByInclusionId(itemInclusionId).update({
  //     parentNode: newParentItem,
  //     orderNum: 0 /*FIXME for changing parent */
  //   })
  // }
}
