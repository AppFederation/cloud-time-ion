// import { TestBed, inject } from '@angular/core/testing';
//
// import {FirestoreTreeService, ORDER_STEP} from './firestore-tree.service';
//
// describe('DbService', () => {
//   // beforeEach(() => {
//   //   TestBed.configureTestingModule({
//   //     providers: [FirestoreTreeService]
//   //   });
//   // });
//
//   xit('should be created', inject([FirestoreTreeService], (service: FirestoreTreeService) => {
//     expect(service).toBeTruthy();
//   }));
//
//   it('should calculate new order number', inject([], () => {
//     expect(DbTreeService.calculateNewOrderNumber(null, 3000000)).toEqual(2000000);
//     expect(DbTreeService.calculateNewOrderNumber(3000000, null)).toEqual(4000000);
//     expect(DbTreeService.calculateNewOrderNumber(null, 0)).toEqual(- ORDER_STEP);
//     expect(DbTreeService.calculateNewOrderNumber(0, null)).toEqual(ORDER_STEP);
//     expect(DbTreeService.calculateNewOrderNumber(null, null)).toEqual(0);
//     expect(DbTreeService.calculateNewOrderNumber(-1, 1)).toEqual(0);
//     expect(DbTreeService.calculateNewOrderNumber(1, 2)).toEqual(1.5);
//     expect(DbTreeService.calculateNewOrderNumber(-1, -2)).toEqual(-1.5);
//   }));
// });
