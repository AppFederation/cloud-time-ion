import { Component, OnInit } from '@angular/core';
import {Meeting} from "../meetings-models/Meeting";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-meeting-details-page',
  templateUrl: './meeting-details.page.html',
  styleUrls: ['./meeting-details.page.sass'],
})
export class MeetingDetailsPage implements OnInit {

  formGroupControls = {
    title: new FormControl(),
    location: new FormControl(),
    date: new FormControl(),
    description: new FormControl(),
  };
  formGroup = new FormGroup(this.formGroupControls);

  meeting ! : Meeting // = new Meeting() // forkDraftItem()

  constructor() {
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(val => {
      this.meeting.patchDraftThrottled(val)
    })
  }

  onPublish() {
    this.meeting.publishDraft()
  }
}
