import {Injectable} from '@angular/core'
import { TestBed, inject } from '@angular/core/testing';

import {
  OryTreeNode,
  TreeModel,
} from './TreeModel'
import {DbTreeService} from './db-tree-service'
import { getDep } from '../test-utils/test-utils'
import {
  DbTreeListener,
  NodeInclusion,
} from './TreeListener'
import { TreeService } from './tree.service'


@Injectable()
export class DbTreeMockService implements DbTreeService {

  HARDCODED_ROOT_NODE_ITEM_ID = 'HARDCODED_ROOT_NODE_ITEM_ID'

  dbTreeListener : DbTreeListener

  addSiblingAfterNode() {}

  addChildNode() {}

  patchChildInclusionData(parentItemId: string, itemInclusionId: string, itemInclusionData: any) {
    console.log('DbTreeMockService patchChildInclusionData', arguments)
    this.dbTreeListener.onNodeInclusionModified(itemInclusionId, itemInclusionData, parentItemId) /* ! WARNING: this causes browser to hang !*/
  }

  loadNodesTree(dbTreeListener: DbTreeListener) {
    this.dbTreeListener = dbTreeListener
  }

  deleteWithoutConfirmation(itemId: string) {
  }

  patchItemData(itemId: string, itemData: any) {
  }

}

///////
fdescribe('OryTreeModel', () => {
  let treeModel: TreeModel
  let treeService: TreeService
  let dbTreeService: DbTreeService

  beforeEach(() => {
    console.log('beforeEach')
    TestBed.configureTestingModule({
      providers: [
        { provide: DbTreeService, useClass: DbTreeMockService },
        TreeService,
      ]
    });
    dbTreeService = TestBed.get(DbTreeService)
    treeService = TestBed.get(TreeService)
    treeModel = treeService.getRootTreeModel()
    // treeModel = new TreeModel(dbTreeService, {
    //   onAfterNodeMoved() {}
    // })
  });
  // provide: useClass / useValue

  function givenTreeModelChildrenOfRoot(childrenOfRoot) {
    const parent = treeModel.root
    let index = -1
    for ( const currentChild of childrenOfRoot ) {
      index ++
      const newNode = new OryTreeNode(
        new NodeInclusion(currentChild.inclusionId),
        currentChild.itemId,
        treeModel,
        {
          title: 'title_itemId_' + currentChild.itemId
        }
      )
      parent.addChild(null, newNode) //  TODO: consider going via onNodeAdded() as if it was all added from DB at the beginning, to be more realistic
      expect(parent.children[index].itemId).toEqual(currentChild.itemId)
      expect(parent.children[index].nodeInclusion.nodeInclusionId).toEqual(currentChild.inclusionId)
      expect(treeModel.mapItemIdToNode.get(currentChild.itemId).length).toEqual(1)
      // addNodeToParent()
    }
  }

  describe('onNodeInclusionModified(...)', () => {
    it('handles node becoming indented', () => {
      givenTreeModelChildrenOfRoot([
        { itemId: 'n1', inclusionId: 'inc1'},
        { itemId: 'n2', inclusionId: 'inc2'},
      ])
      treeModel.onNodeInclusionModified('inc2', {}, 'n1')
      expect(treeModel.root.children[0].children[0].itemId).toEqual('n2')
    })
  })

  it('handles indentIncrease()', () => {
    givenTreeModelChildrenOfRoot([
      { itemId: 'n1', inclusionId: 'inc1'},
      { itemId: 'n2', inclusionId: 'inc2'},
    ])
    treeModel.root.children[1].indentIncrease() /* ! WARNING: this causes browser to hang !*/
    expect(treeModel.root.children[0].children[0].itemId).toEqual('n2')
    expect(treeModel.root.children[0].children[0].nodeInclusion.nodeInclusionId).toEqual('inc2')
  })

  xit('handles indentDecrease()', () => {
    givenTreeModelChildrenOfRoot([
      { itemId: 'n1', inclusionId: 'inc1', children: [
          { itemId: 'n2', inclusionId: 'inc2'}
        ]
      },
    ])
    treeModel.root.children[0].children[0].indentDecrease() /* ! WARNING: this causes browser to hang !*/
    expect(treeModel.root.children[0].children[0].itemId).toEqual('n2')
    expect(treeModel.root.children[0].children[0].nodeInclusion.nodeInclusionId).toEqual('inc2')
  })

  // test outdentDecrease()

  // TODO: test reorder up/down - it creates triple duplicates

  it('reorders down', () => {
    givenTreeModelChildrenOfRoot([
      { itemId: 'n1', inclusionId: 'inc1'},
      { itemId: 'n2', inclusionId: 'inc2'},
    ])
    expect(treeModel.mapItemIdToNode.get('n1').length).toEqual(1)
    treeModel.root.children[0].reorderDown()
    expect(treeModel.mapItemIdToNode.get('n1').length).toEqual(1) // this assertion fails; but to really fix it, I should do multi-parent and unify add/reorder/move/copy


  })

  // TODO: test indent after multiple reorders - looks like the map gets filled with multiple copies of the same node?
  // TODO: assert there is only one copy of the node in the map id->node

  // it('adds first node to root, via as child of root', inject([TreeModel], (treeModel: TreeModel) => {
    // const newNode = treeModel.root.addChild()
    // expect(newNode.parent2 === treeModel.root)
    // expect(newNode.treeModel === treeModel)
    // // expect(newNode.nodeInclusion.orderNum).toEqual(0)
    // // expect(dbTreeService.addNode).hasBeenCalled(undefined, undefined, newNode)
    // // todo: assert method has only called once (to detect the bug with duplicate nodes in firestore)
    // expect(treeModel.root.children).toEqual([newNode])
  // }))

})
