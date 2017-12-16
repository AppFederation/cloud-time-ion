import { Component, OnInit } from '@angular/core';
import {FirestoreTreeService, debugLog} from '../shared/firestore-tree.service'

@Component({
  selector: 'app-test-firestore',
  templateUrl: './test-firestore.component.html',
  styleUrls: ['./test-firestore.component.scss']
})
export class TestFirestoreComponent implements OnInit {

  elements = []

  constructor(
    // public dbService: FirestoreTreeService
  ) { }

  ngOnInit() {

  }


  // addItemToFirebase() {
  //   this.dbService.addItem()
  //   this.dbService.listenToChanges(s => {
  //     s.docChanges.forEach(change => {
  //       let data = change.doc.data()
  //       debugLog('change', change)
  //       if (change.type === 'added') {
  //         debugLog('New city: ', data);
  //         this.elements.push(data)
  //         this.elements = this.elements.slice(0)
  //       }
  //       if (change.type === 'modified') {
  //         debugLog('Modified city: ', data);
  //       }
  //       if (change.type === 'removed') {
  //         debugLog('Removed city: ', data);
  //       }
  //     });
  //
  //   })
  // }

}
