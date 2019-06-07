import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

export type Mood = number

/* TODO: make it a custom form control */

@Component({
  selector: 'app-mood-picker',
  templateUrl: './mood-picker.component.html',
  styleUrls: ['./mood-picker.component.sass'],
})
export class MoodPickerComponent implements OnInit {

  @Output() mood = new EventEmitter<Mood>()

  n = new FormControl()
  selectedMood

  constructor() { }

  ngOnInit() {}

  setMood(n: number) {
    this.selectedMood = n
    this.mood.next(n)
  }
}
