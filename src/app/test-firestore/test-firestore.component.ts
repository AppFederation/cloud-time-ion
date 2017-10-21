import { Component, OnInit } from '@angular/core';
import {DbService} from '../db.service'

@Component({
  selector: 'app-test-firestore',
  templateUrl: './test-firestore.component.html',
  styleUrls: ['./test-firestore.component.scss']
})
export class TestFirestoreComponent implements OnInit {

  elements = []

  constructor(
    public dbService: DbService
  ) { }

  ngOnInit() {

  }

  addItemToFirebase() {
    this.dbService.addItem()
    this.dbService.listenToChanges(s => {
      s.docChanges.forEach(change => {
        let data = change.doc.data()
        console.log('change', change)
        if (change.type === 'added') {
          console.log('New city: ', data);
          this.elements.push(data)
          this.elements = this.elements.slice(0)
        }
        if (change.type === 'modified') {
          console.log('Modified city: ', data);
        }
        if (change.type === 'removed') {
          console.log('Removed city: ', data);
        }
      });

    })
  }

}
