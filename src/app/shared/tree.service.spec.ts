import { TestBed, inject } from '@angular/core/testing';

import {NodeAddEvent, NodeInclusion, OryTreeNode, TreeModel, TreeService} from './tree.service';

function expectNodeIds(actualNodes: OryTreeNode[] | TreeModel, expectedNodeIds: string) {
  if ( actualNodes instanceof TreeModel ) {
    actualNodes = actualNodes.root.children
  }
  const expectedChildrenIdsArr = expectedNodeIds.split(',').map(str => str.trim())
  const actualChildrenIdsArr = actualNodes.map(child => child.dbId)
  expect(actualChildrenIdsArr).toEqual(expectedChildrenIdsArr)
  // expect(children.length).toBe(expectedChildrenIdsArr.length)
  // expect(children[0].dbId).toBe('id1')
  // expect(children[1].dbId).toBe('id2')

}

function addNode(treeModel, orderThisAfterId, nodeInclusionId, orderThisBeforeId, orderNum?: number) {
  treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node content*/, nodeInclusionId,
    null, new NodeInclusion(orderThisBeforeId, orderThisAfterId, orderNum) ))
}

// TODO:
// - adapt to expectNodeIds
// - test adding to non-root
// - create shorthand function for posting node events
// - use TreeModel in TreeHost
// - change id-s next/previous to be id-s of nodeInclusion, not node id
// - add button to add node before/after
// - add animation for new nodes to see if it goes before or after
// - errors/notifications service for node order conflicts
// - use UiNotificationsService in UI
// - in tests make sure there were no warning notifications from UINotifService

describe('TreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeService]
    });
  });

  it('should be created', inject([TreeService], (service: TreeService) => {
    expect(service).toBeTruthy();
  }));

  it('adds first and only node', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id1', null)
    expectNodeIds(treeModel, 'id1')
  })

  it('adds node after as rightmost', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id1', null, 0)
    addNode(treeModel, 'id1', 'id2', null, 1)
    expectNodeIds(treeModel, 'id1, id2')
  })

  it('adds node after as rightmost again', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id1', null, 0)
    addNode(treeModel, 'id1', 'id2', null, 1)
    addNode(treeModel, 'id2', 'id3', null, 1)
    expectNodeIds(treeModel, 'id1, id2, id3')
  })

  it('adds node before as leftmost', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id2', null, 0)
    addNode(treeModel, null, 'id1', 'id2', 0)
    expectNodeIds(treeModel, 'id1, id2')
  })

  it('adds node before as leftmost again', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id2', null, 0)
    addNode(treeModel, null, 'id1', 'id2', 0)
    addNode(treeModel, null, 'id0', 'id1', 0)
    expectNodeIds(treeModel, 'id0, id1, id2')
  })

  it('adds node between', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id1', null)
    addNode(treeModel, 'id1', 'id3', null)
    addNode(treeModel, 'id1', 'id2', 'id3')
    expectNodeIds(treeModel, 'id1, id2, id3')
  })

  it('adds node between another', () => {
    const treeModel = new TreeModel()
    addNode(treeModel, null, 'id1', null)
    addNode(treeModel, 'id1', 'id3', null)
    addNode(treeModel, 'id1', 'id2', 'id3')
    addNode(treeModel, 'id2', 'id2_2', 'id3')
    expectNodeIds(treeModel, 'id1, id2, id2_2, id3')
  })

  // it('errors adding node after non-existing when empty', () => {
  //   const treeModel = new TreeModel()
  //   const root = treeModel.root
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id1', null, new NodeInclusion(null, null, 0) ))
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id3', null, new NodeInclusion(null, 'id1', 0) ))
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id2', null, new NodeInclusion('id3', 'id1', 0) ))
  //   expect(root.children.length).toBe(2)
  //   expect(root.children[0].dbId).toBe('id1')
  //   expect(root.children[1].dbId).toBe('id2')
  //   expect(root.children[2].dbId).toBe('idZZZZ')
  // })
  //
  // it('errors adding node after non-existing when non-empty', () => {
  //   const treeModel = new TreeModel()
  //   const root = treeModel.root
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id1', null, new NodeInclusion(null, null, 0) ))
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id3', null, new NodeInclusion(null, 'id1', 0) ))
  //   treeModel.onNodeAdded(new NodeAddEvent(null, null, null /* TODO: node*/, 'id2', null, new NodeInclusion('id3', 'id1', 0) ))
  //   expect(root.children.length).toBe(3)
  //   expect(root.children[0].dbId).toBe('id1')
  //   expect(root.children[1].dbId).toBe('id2')
  //   expect(root.children[2].dbId).toBe('idZZZZZ')
  // })
});
