import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'app-quiz-diligence-level',
  templateUrl: './quiz-diligence-level.component.html',
  styleUrls: ['./quiz-diligence-level.component.sass'],
})
export class QuizDiligenceLevelComponent implements OnInit {

  @Input()
  @Required()
  control ! : FormControl

  constructor() { }

  ngOnInit() {}

}
