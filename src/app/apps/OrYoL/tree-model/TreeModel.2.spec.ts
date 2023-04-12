import { TestBed } from '@angular/core/testing';

import {
  TreeModel,
} from './TreeModel'
import { DbTreeService } from './db-tree-service'
import {
  NodeAddEvent,
  NodeInclusion,
} from './TreeListener'
import { TreeService } from './tree.service'
import { AuthService } from '../core/auth.service'
import { TimeTrackingService } from '../time-tracking/time-tracking.service'
import { DbTreeServiceMock } from './DbTree.service.mock'

import {ApfNonRootTreeNode} from './RootTreeNode'


///////
describe('OryTreeModel', () => {
  let treeModel: TreeModel
  let treeService: TreeService
  let dbTreeService: DbTreeService

  beforeEach(() => {
    console.log('beforeEach')
    TestBed.configureTestingModule({
      providers: [
        { provide: DbTreeService, useClass: DbTreeServiceMock },
        { provide: AuthService, useClass: AuthService },
        TreeService,
        TimeTrackingService,
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
      expect(treeModel.mapItemIdToNodes.get(currentChild.itemId).length).toBeGreaterThan(0)
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
    expect(treeModel.getNodesByItemId('n1').length).toEqual(1)
    treeModel.root.children[0].reorderDown()
    expect(treeModel.getNodesByItemId('n1').length).toEqual(1) // this assertion fails; but to really fix it, I should do multi-parent and unify add/reorder/move/copy
  })

  function itHandlesInsertionOfNodeWithMultipleParents(viaExternalEvent: boolean) {
    it('handles insertion of node with multiple parents, via: ' + (viaExternalEvent ? 'external event' : 'local user action'), () => {
      givenTreeModelChildrenOfRoot([
        {itemId: 'parentItemId', inclusionId: 'incP1'},
        {itemId: 'parentItemId', inclusionId: 'incP2'},
      ])
      expect(treeModel.getNodesByItemId('parentItemId').length).toBe(2)
      const parentNodes = treeModel.getNodesByItemId('parentItemId')

      let childItemId = 'childItemId'
      if (viaExternalEvent) {
        treeModel.onNodeAdded(new NodeAddEvent(
          null, 'parentItemId', {}, childItemId, 0,
          new NodeInclusion('incChild', 0),
        ))
      } else {
        const childNode = parentNodes[0].addChild()
        childItemId = childNode.itemId
      }
      // verify child node added in both parent nodes:
      expect(parentNodes[0].children[0].itemId).toBe(childItemId)
      expect(parentNodes[1].children[0].itemId).toBe(childItemId)
      // ======= Level 2:
      let childItemLv2Id = 'childItemLv2Id'
      if (viaExternalEvent) {
        treeModel.onNodeAdded(new NodeAddEvent(
          null, childItemId, {}, childItemLv2Id, 0,
          new NodeInclusion('incChildLv2', 0),
        ))
      } else {
        childItemLv2Id = parentNodes[0].addChild().itemId
      }
      const childNodes = treeModel.getNodesByItemId(childItemId)
      expect(childNodes.length).toBe(2)
      expect(childNodes[0].children[0].itemId).toBe(childItemLv2Id)
      expect(childNodes[1].children[0].itemId).toBe(childItemLv2Id) // this should FAIL coz not working in UI
      // treeModel.root.debugDump() /* compare json */
    })
  }

  itHandlesInsertionOfNodeWithMultipleParents(true)

  itHandlesInsertionOfNodeWithMultipleParents(false)

  it(`handles moving into db item which is in multiple nodes` /* onNodeInclusionModified moving node and there are multiple new parents - not yet impl.!*/)

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
