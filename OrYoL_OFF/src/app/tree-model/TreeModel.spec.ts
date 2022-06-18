//
// import {Injectable} from '@angular/core'
// // fdescribe('TreeModel', () => {
// //   it('should be created', inject([FirestoreTreeService], (service: FirestoreTreeService) => {
// //     expect(service).toBeTruthy();
// //   }));
// // });
//
//
// import { TestBed, inject } from '@angular/core/testing';
//
// import {TreeModel} from './TreeModel'
// import {DbTreeService} from './db-tree-service'
//
// // describe('TestService', () => {
// //   beforeEach(() => {
// //     TestBed.configureTestingModule({
// //       providers: [TestService]
// //     });
// //   });
// //
// //   it('should be created', inject([TestService], (service: TestService) => {
// //     expect(service).toBeTruthy();
// //   }));
// // });
//
//
//
//
// @Injectable()
// export class DbTreeMockService {
//   addSiblingAfterNode() {}
// }
//
// ///////
// xdescribe('OryTreeModel', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: DbTreeService, useClass: DbTreeMockService },
//         TreeModel,
//       ]
//     });
//   });
//   // provide: useClass / useValue
//
//   it('adds first node to root, via as child of root', inject([TreeModel], (treeModel: TreeModel) => {
//     const newNode = treeModel.root.addChild()
//     expect(newNode.parent2 === treeModel.root)
//     expect(newNode.treeModel === treeModel)
//     expect(newNode.nodeInclusion.orderNum).toEqual(0)
//     // expect(dbTreeService.addNode).hasBeenCalled(undefined, undefined, newNode)
//     // todo: assert method has only called once (to detect the bug with duplicate nodes in firestore)
//     expect(treeModel.root.children).toEqual([newNode])
//   }))
//
//
//   // it('adds node below last node, via as child of root') {
//   //   treeModel.root.lastChild. ...
//   // }
//
//   it('adds node below last node, via below existing',
//       inject([TreeModel], (treeModel: TreeModel) => {
//     const dummy = treeModel.root.addChild() // prepare dummy
//     // act:
//     const newNode = treeModel.root.lastChildNode.addSiblingAfterThis()
//     expect(newNode.parent2).toBe(treeModel.root)
//     expect(newNode.treeModel).toBe(treeModel)
//     expect(newNode.nodeInclusion.orderNum).toEqual(ORDER_STEP)
//     expect(treeModel.root.children).toEqual([dummy, newNode])
//     const newNode2 = newNode.addSiblingAfterThis()
//     expect(newNode2.nodeInclusion.orderNum).toEqual(ORDER_STEP * 2)
//     // expect(dbTreeService.addNode).hasBeenCalled(undefined, undefined, newNode)
//     // todo: assert method has only called once (to detect the bug with duplicate nodes in firestore)
//     console.log('actualChildren', treeModel.root.children)
//     expect(treeModel.root.children).toEqual([dummy, newNode, newNode2])
//   }))
//
//
//   it('adds node between nodes, after topmost, via below existing',
//       inject([TreeModel], (treeModel: TreeModel) => {
//     const dummy1 = treeModel.root.addChild() // prepare dummy
//     const dummy2 = dummy1.addSiblingAfterThis() // prepare dummy
//     expect(treeModel.root.children).toEqual([dummy1, dummy2])
//     // act:
//     const newNode = dummy1.addSiblingAfterThis()
//     expect(newNode.parent2).toBe(treeModel.root)
//     expect(newNode.treeModel).toBe(treeModel)
//     expect(newNode.nodeInclusion.orderNum).toEqual(ORDER_STEP / 2)
//     // expect(dbTreeService.addNode).hasBeenCalled(undefined, undefined, newNode)
//     // todo: assert method has only called once (to detect the bug with duplicate nodes in firestore)
//     const actualChildren = treeModel.root.children
//     console.log('actualChildren', actualChildren)
//     expect(actualChildren).toEqual([dummy1, newNode, dummy2])
//   }))
//
//   // it('adds node between nodes, after topmost, via below existing') {
//   //   treeModel.root.topMostChild.addNodeBelow(...
//   // }
//   //
//   // it('adds node between nodes, after second, via below existing') {
//   //   treeModel.root.children[1].addNodeBelow(...
//   // }
// })
