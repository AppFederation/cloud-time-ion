// import { TestBed } from '@angular/core/testing';
// import {OdmService} from "./OdmService";
// import {OdmItem} from "./OdmItem";
// import {Injectable, Injector} from "@angular/core";
// import {OdmBackend} from "./OdmBackend";
// import {OdmCollectionBackend, OdmCollectionBackendListener} from "./OdmCollectionBackend";
// import {debugLog} from "../utils/log";
//
// class SutItem extends OdmItem<SutItem> {
//   stringField ! : string
//   numberField ! : number
// }
//
// @Injectable()
// class SutOdmService extends OdmService<SutItem> {
//   constructor(injector: Injector) {
//     super(injector, 'SutItem')
//   }
//
//   protected convertFromDbFormat(dbItem: SutItem): SutItem {
//     return Object.assign(new SutItem(this), dbItem)
//   }
//
// }
//
// @Injectable()
// class FakeOdmBackend extends OdmBackend {
//   constructor(injector: Injector) { super(injector) }
//
//   createCollectionBackend<T extends OdmItem<T>>(injector: Injector, className: string): OdmCollectionBackend<T> {
//     return new FakeBackendCollection<any>(injector, className, this as any)
//   }
// }
//
// class FakeBackendCollection<T extends OdmItem<T>> extends OdmCollectionBackend<T> {
//   constructor(injector: Injector, className, odmBackend) {
//     super(injector, className, odmBackend)
//   }
//
//   saveNowToDb(item: T) {
//     return undefined as any
//   }
//
//   deleteWithoutConfirmation(itemId: string) {
//   }
// }
//
// describe('OdmService: ', () => {
//   let service: SutOdmService
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [SutOdmService, {provide: OdmBackend, useClass: FakeOdmBackend}]
//     })
//     service = TestBed.get(SutOdmService);
//   })
//
//   it('should be created', () => {
//     const odmBackend = TestBed.get(OdmBackend);
//     console.log('odmBackend', odmBackend)
//     expect(service).toBeTruthy();
//   });
//
//   describe('reaction to local saves by user: ', () => {
//     it('saves new item', () => {
//       let sutItem = new SutItem(service, 'newItemId1');
//       sutItem.patchNow({}) // TODO: save?
//       sutItem.patchNow({stringField: 'str1'})
//       // service.
//     })
//   })
//
//   describe('reaction to changes incoming from db: ', () => {
//     let newItem = {
//       stringField: 'str',
//       numberField: 100,
//     } as SutItem
//
//     let newItemModified1 = {
//       stringField: 'strMod1',
//       numberField: 101,
//     } as SutItem
//
//     let newItemModified2 = {
//       stringField: 'strMod2',
//       numberField: 102,
//     } as SutItem
//
//     let listener: OdmCollectionBackendListener<OdmItem<SutItem>>
//
//     beforeEach(() => {
//       listener = service.odmCollectionBackend.listener as any
//     })
//
//     function testAdded() {
//       listener.onAdded('addedId1', newItem)
//       debugLog('testAdded -- service.localItems$.lastVal', service.localItems$.lastVal)
//
//       expect(service.localItems$.lastVal).toEqual([null as any])
//     }
//
//     function testModified1() {
//       listener.onModified('addedItem1', newItemModified1)
//       debugLog('testModified1 -- service.localItems$.lastVal', service.localItems$.lastVal)
//       expect(service.localItems$.lastVal).toEqual([null as any])
//     }
//
//     xit('reacts to item added from db', () => {
//       testAdded()
//     })
//
//     xit('reacts to item modified from db', () => {
//       testAdded()
//       testModified1();
//     })
//
//     xit('reacts to item modified from db second time', () => {
//       testAdded()
//       testModified1()
//       listener.onModified('addedItem1', newItemModified1)
//       expect(service.localItems$.lastVal).toEqual([newItemModified1])
//     })
//
//   })
// });
