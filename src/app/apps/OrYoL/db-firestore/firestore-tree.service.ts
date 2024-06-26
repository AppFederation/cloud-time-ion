import { Injectable } from '@angular/core';
import {
  DbTreeListener,
  NodeAddEvent,
  NodeInclusion,
} from '../tree-model/TreeListener'
import {
  debugLog, errorAlert,
} from '../utils/log'
import { DbTreeService } from '../tree-model/db-tree-service'
import { FirestoreAllItemsLoader } from './firestore-all-items-loader'

import { FIXME } from '../utils/log'
import {FirestoreAllInclusionsSyncer, loadArchivedItems} from './FirestoreAllInclusionsSyncer'
import { ChildrenChangesEvent } from '../tree-model/children-changes-event'
import { NodeOrderer } from '../tree-model/node-orderer'
import { TimeStamper } from '../tree-model/TimeStamper'
import firestore from 'firebase/compat/app'

// const firebase1 = require('firebase');
import * as firebase1 from 'firebase/app'
import 'firebase/compat/firestore';
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {AngularFirestore, DocumentReference, DocumentSnapshot, Query} from '@angular/fire/compat/firestore'
// Required for side-effects
// require('firebase/firestore');


/// ==== new SDK:
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from '../../../firebase.config'
import {Firestore} from '@angular/fire/firestore'
import firebase from 'firebase/compat/app'
import CollectionReference = firebase.firestore.CollectionReference
import {SyncStatusService} from '../../../libs/AppFedShared/odm/sync-status.service'
import {ItemId} from '../db/OryItem$'
import {OryBaseTreeNode, OryNonRootTreeNode} from '../tree-model/TreeModel'

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// =====


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


console.log('firebase1', firebase1)

// export const firebaseApp = firebase1.initializeApp({
//   apiKey: 'AIzaSyAVVLpc9MvJw7dickStZcAd3G5ZI5fqE6I',
//   authDomain: 'oryol-app.firebaseapp.com',
//   databaseURL: 'https://oryol-app.firebaseio.com',
//   projectId: 'oryol-app',
//   storageBucket: 'oryol-app.appspot.com',
//   messagingSenderId: '970393221829'
// })

console.log('firebase1', firebase1)
// console.log('firebaseApp', firebaseApp)


// Initialize Cloud Firestore through Firebase
// const firestore1 = firebase1.firestore();
// export const firestore1 = firebaseApp.firestore();
// const db = firestore1;
// firestore1.settings({
//   // timestampsInSnapshots: true,
// })

export interface FirestoreNodeInclusion {
  childNode: DocumentReference,
  orderNum: number,
  nodeInclusionId: string
  /** only in AllItemsSyncer; should really be called parentItem ? */
  parentNode: DocumentReference,
}


@Injectable({providedIn: 'root'})
export class FirestoreTreeService extends DbTreeService {

  static dbPrefix = 'DbWithAllInclusionsSyncer2'
  // static dbPrefix = 'DbWithAllInclusionsSyncer2_test_'
  // static dbPrefix = 'oryol_test_'

  pendingListeners = 0

  db = this.angularFirestore.firestore

  private ITEMS_COLLECTION = FirestoreTreeService.dbPrefix + '_items'
  private ROOTS_COLLECTION = FirestoreTreeService.dbPrefix + '_roots'
  // private dbItemsLoader: FirestoreItemsLoader = new FirestoreIndividualItemsLoader()
  dbItemsLoader = new FirestoreAllItemsLoader()
  dbInclusionsSyncer = new FirestoreAllInclusionsSyncer(this.db, FirestoreTreeService.dbPrefix)
  private timeStamper = new TimeStamper()


  constructor(
    protected angularFirestore: AngularFirestore,
    protected syncStatusService: SyncStatusService,
  ) {
    super()
    // this.db.enablePersistence().then(() => {
    //   // window.alert('persistence enabled')
      this.dbItemsLoader.startQuery(this.itemsQuery())
      this.dbInclusionsSyncer.startQuery()
    // }).catch((caught: any) => {
    //   errorAlert('enablePersistence error', caught)
    // })
    // this.listenToChanges(onSnapshotHandler)
  }

  deleteWithoutConfirmation(itemId: string) {
    let promise = this.itemDocById(itemId).update('deleted', new Date()) // TODO
    this.syncStatusService.handleSavingPromise(promise)
    console.log('deleteWithoutConfirmation deleted ' + itemId)
  }

  loadNodesTree(listener: DbTreeListener) {
    debugLog('loadNodesTree')
    // db.collection(this.ROOTS_COLLECTION).onSnapshot(snapshot => {
      // console.log('loadNodesTree onSnapshot()', snapshot)
    // })
    // this.processNodeEvents(0, snapshot, [], listener)
    this.handleSubNodes(this.itemDocById(this.HARDCODED_ROOT_NODE_ITEM_ID), [], 0, listener)
  }

  private processNodeEvents(nestLevel: number, childrenChangesEvent: ChildrenChangesEvent, parents: DocumentReference[], listener: DbTreeListener) {
    const serviceThis = this
    childrenChangesEvent.inclusionsAdded.forEach(inclusionAdded => {
      // console.log(`FirestoreTreeService childrenChangesEvent.inclusionsAdded`, inclusionAdded)

      // debugLog('docChanges change.type', change.type);

      // debugLog('nodeInclusionData ... change.doc', change.doc)
      const nodeInclusionData = inclusionAdded.data() as FirestoreNodeInclusion
      const nodeInclusionId = nodeInclusionData.nodeInclusionId
      // if (change.type === 'added') {
        const parentsPath = serviceThis.nodesPath(parents)
        // FIXME: why is this called when parent node is EDITED ???
        debugLog('added-node-inclusion event: ', nestLevel, parentsPath, 'nodeInclusionData: ', nodeInclusionData);
        debugLog('listener.onNodeAddedOrModified change includedItemDoc.id ' + nodeInclusionData.childNode.id, childrenChangesEvent)
        serviceThis.pendingListeners ++
        // ==== per-item callback:
        serviceThis.dbItemsLoader.getItem$ByRef(nodeInclusionData.childNode, (includedItemDoc: DocumentSnapshot<any>) => {
          serviceThis.pendingListeners --
          // const nodeInclusionId = change.doc.id FIXME()
          // console.log('nodeInclusionId', nodeInclusionId)
          const nodeInclusion = new NodeInclusion(nodeInclusionId, nodeInclusionData.parentNode.id, nodeInclusionData.orderNum)
          Object.assign(nodeInclusion, nodeInclusionData) // NOTE: this should assign orderNum
          // console.log('includedItemDoc', includedItemDoc)
          const itemData = includedItemDoc.exists ? includedItemDoc.data() : null
          // console.log('itemData:::', itemData)
          debugLog('listener.onNodeAddedOrModified change includedItemDoc.id ' + includedItemDoc.id, childrenChangesEvent)
          listener.onNodeAddedOrModified(
            new NodeAddEvent(parentsPath, parentsPath[parentsPath.length - 1], itemData, includedItemDoc.id,
              serviceThis.pendingListeners, nodeInclusion))
          // debugLog('target node:', nestLevel, includedItemDoc)
          // debugLog('target node title:', nestLevel, targetNodeDoc.data().title)
        })
        // ==== end per-item callback
        serviceThis.handleSubNodes(nodeInclusionData.childNode, parents, nestLevel, listener) // why is this inside per-item callback?

        // debugLog('root node ref: ', targetNode);
      // }
      // if (change.type === 'modified') {
      //   debugLog('Modified city: ', nodeInclusionData);
      //   listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData)
      // }
      // if (change.type === 'removed') {
      //   debugLog('Removed city: ', nodeInclusionData);
      // }
    })
    childrenChangesEvent.inclusionsModified.forEach(inclusionModified => {
      const nodeInclusionData = inclusionModified.data() as FirestoreNodeInclusion
      const nodeInclusionId = nodeInclusionData.nodeInclusionId
      console.log(`FirestoreTreeService listener.onNodeInclusionModified`, inclusionModified)
      listener.onNodeInclusionModified(nodeInclusionId, nodeInclusionData, nodeInclusionData.parentNode !. id)
    })

  }

  private handleSubNodes(targetNodeDocRef: DocumentReference, parents: DocumentReference[], nestLevel: number, listener: DbTreeListener) {
    // TODO: do not use subCollection for FirestoreAllInclusionsSyncer - all inclusions are in a single collection
    this.dbInclusionsSyncer.getChildInclusionsForParentItem$(targetNodeDocRef.id).subscribe(event => {
      const newParents: DocumentReference[] = parents.slice(0)
      newParents.push(targetNodeDocRef)
      this.processNodeEvents(nestLevel + 1, event, newParents, listener)
    })
    // const subCollection = targetNodeDocRef.collection('subNodes' /* note: those are really inclusions of sub nodes */)
    // debugLog('subColl:', subCollection)
    // subCollection.onSnapshot((subSnap: QuerySnapshot) => {
    //   const newParents: DocumentReference[] = parents.slice(0)
    //   newParents.push(targetNodeDocRef)
    //   this.processNodeEvents(nestLevel + 1, subSnap, newParents, listener)
    // })
  }

  nodesPath(path: DocumentReference[]) {
    return path.map(ref => {
      // let segments = ref.id.path.segments
      return ref.id // hack: probably replace with change.doc.id
    })
  }

  private itemsCollection(): CollectionReference {
    return this.db.collection(this.ITEMS_COLLECTION)
  }

  private itemsQuery(): Query {
    let ret: Query = this.itemsCollection()
    if ( ! loadArchivedItems ) {
      ret = ret.where('isArchived', '==', false)
    }
    return ret
  }

  private itemDocById(dbId: string): DocumentReference {
    return this.itemsCollection().doc(dbId)
  }

  private addNodeInclusionToParent(parentId: string, nodeInclusion: NodeInclusion /*{ node: firebase.firestore.DocumentReference }*/,
                                   childItemDocRef: DocumentReference
  ) {
    const nodeInclusionFirebaseObject: Omit<FirestoreNodeInclusion, 'parentNode'> = this.buildNodeInclusionFirebaseObject(childItemDocRef, nodeInclusion)
    debugLog('FirestoreTreeService nodeInclusionFirebaseObject', nodeInclusionFirebaseObject)
    // this.subNodesCollectionForItem(parentId).add(nodeInclusionFirebaseObject)
    // this.dbInclusionsSyncer.addNodeInclusionToParent(nodeInclusion.nodeInclusionId, parentId, nodeInclusionFirebaseObject)
    const promise = this.dbInclusionsSyncer.addNodeInclusionToParent(nodeInclusion, parentId, this.itemDocById(parentId), nodeInclusionFirebaseObject)
    return promise
  }

  private buildNodeInclusionFirebaseObject(childItemDocRef: DocumentReference, nodeInclusion: NodeInclusion) {
    const nodeInclusionFirebasePart: Omit<FirestoreNodeInclusion, 'parentNode' /* FIXME parentNode is filled in addNodeInclusionToParent */> = {
      // childNode: this.itemDocById(childNode.dbId),
      childNode: childItemDocRef,
      orderNum: nodeInclusion.orderNum ! /* FIXME make this non-optional */,
      // orderNum: nodeInclusion.orderNum,
      nodeInclusionId: nodeInclusion.nodeInclusionId, /* this can be removed later before serializing, to save space; this can be inferred from firestore document id; it's a bit like $key */
    }
    const nodeInclusionFirebaseObject = Object.assign({}, nodeInclusion, nodeInclusionFirebasePart) // note: this will set orderNum
    // delete parentId, as it is stored in Firestore as `parentNode: (doc ref)` :
    delete (nodeInclusionFirebaseObject as { parentItemId?: ItemId }).parentItemId
    return nodeInclusionFirebaseObject
  }

// TODO:
// to as little as possible in vendor specific class (FirestoreTreeService)
// pre-calculate next/previous order in TreeModel
//   addNodeToDb(parent, nodeBefore, odeAfter, orderBefore, orderAfter) {
//
//   }

  /* TODO: should be called *create*, because it is a completely new node/item involving db, vs addChild just looks like tree-only operation */
  addChildNode(parentNode: OryBaseTreeNode, newNode: OryNonRootTreeNode) {
    debugLog('addSiblingAfterNode', newNode)
    // let parentId = afterExistingNode.parent2.dbId // will not work yet; "imaginary root"
    // let parentId = this.HARDCODED_ROOT_NODE // HACK to simplify for now
    let parentId = parentNode.itemId // HACK to simplify for now
    // console.log('addSiblingAfterNode nodeBelow', nodeBelow)
    // add node itself to firestore (BEFORE inclusion)
    // const newItem = {
    //   // title: 'added node title ' + new Date()
    //   title: OryTreeNode.INITIAL_TITLE
    // }
    // newNode.itemData = newItem // this was added while adding timestamps; FIXME: overwriting whatever might be there
    this.timeStamper.onAfterCreated(newNode.content.itemData)
    newNode.content.itemData.isArchived = false // TODO isArchivedWhen
    this.itemsCollection().doc(newNode.itemId).set(newNode.content.itemData).then(() => {
      const itemDocRef = this.itemDocById(newNode.itemId)
      // console.log('itemDocRef', itemDocRef)
      // newNode.itemId = itemDocRef.id // NOTE: initially it is UUID, overwritten here /* Perhaps this indirectly causes ExpressionChangedAfterItHasBeenCheckedError */
      this.addNodeInclusionToParent(parentId, newNode.nodeInclusion !, itemDocRef)
    })
    // add node-inclusion to firestore
    // ignore parent for now? But then how do we specify node-inclusion / order?
    // -> make a hardcoded root for my flexagenda tasks

    // For FlexAgenda-Oryol prototype: only use a hardcoded node as a root of the *tree*model*.
    // on firestore, ignore completely the concept of roots, or adding or listing them

    // design question: order is only specified in node-inclusion?
    // meaning: if a node is not included in a parent, it has no ordering? Probably.

    // ======
    // !!!! Idea/Epiphany: for retrieving ALL of user's nodes in one query (for a a MASSIVE speedup), I could try to use Firestore's query,
    // which CAN supposedly work across even nodes for which we do not have permissions to read, as long as they are
    // not included in the results (vs "rules are NOT filters" in Firebase realtime DB).
    // for the query criterion, I could use a special attribute, e.g. User_read_permitted_<USER_ID>=true
    // FIXME()
    // throw new Error('TESTING')

    // TODO: return nodeInclusion? (could be useful if it was not provided as an argument)
  }

  addAssociateSiblingAfterNode(parentNode: OryBaseTreeNode, nodeToAssociate: OryNonRootTreeNode, associateAfterNode: OryNonRootTreeNode | nullish) {
    const itemDocRef = this.itemDocById(nodeToAssociate.itemId)
    this.addNodeInclusionToParent(parentNode.itemId, nodeToAssociate.nodeInclusion !, itemDocRef)
  }

  patchItemData(itemId: string, itemData: any) {
    this.timeStamper.onBeforeSaveToDb(itemData)

    /**
     * TODO check: "The update will fail if applied to a document that does not exist."
     * @return
     A Promise resolved once the data has been successfully written to the backend
     (Note that it won't resolve while you're offline). */
    console.log('FirestoreTreeService extends DbTreeService: patchItemData', itemData)
    let promise = this.itemDocById(itemId).update(itemData)
    return { onPatchSentToRemote: promise }
  }

  patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: NodeInclusion, childItemId: string) {
    // FIXME: this should build the whole inclusion object and use .set() instead of .update()
    debugLog('patchChildInclusionData', arguments)
    // in order to work around the "no document to update" issue, we use the same function as for adding new inclusions:
    this.syncStatusService.handleSavingPromise(
      this.addNodeInclusionToParent(parentItemId, itemInclusionData, this.itemDocById(childItemId)),
      'moving tree node',
    )
    // const inclusionRawObject = {} as any // Firestore wants object, does not accept instance of NodeInclusion
    // Object.assign(inclusionRawObject, itemInclusionData)
    // inclusionRawObject.parentNode = this.itemDocById(parentItemId)
    // this.dbInclusionsSyncer.patchChildInclusionData(parentItemId, itemInclusionId, inclusionRawObject)
  }

//   patchChildInclusionDataWithNewParent(
//     nodeInclusionId: string,
//     newParentNode: OryTreeNode,
//     // beforeNode: { beforeNode: OryTreeNode },
//     // order: {
//     //   inclusionBefore ? : NodeInclusion,
//     //   inclusionAfter ? : NodeInclusion,
//     // }
//   ) {
//     // NOTE: this needs to be done in TreeModel/OryTreeNode anyway, because we add to UI immediately, not waiting for DB:
//     // this.nodeOrderer.addOrderMetadataToInclusion(order, inclusion)
//
//     this.dbInclusionsSyncer.patchChildInclusionDataWithNewParent(
//       nodeInclusionId, this.itemDocById(newParentNode.itemId),
//     )
//   }
//
}
