import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'

@Component({
  selector: 'app-quiz-categories-picker',
  templateUrl: './quiz-categories-picker.component.html',
  styleUrls: ['./quiz-categories-picker.component.sass'],
})
export class QuizCategoriesPickerComponent implements OnInit {

  // formGroup = new FormGroup(this.controls)
  //
  // viewSyncer = new ViewSyncer(this.formGroup, this.quizService.options2$, false, 'powBaseX100')


  constructor() { }

  ngOnInit() {}

}
