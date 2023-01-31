import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-quiz-interval-importance-scaling',
  templateUrl: './quiz-interval-importance-scaling.component.html',
  styleUrls: ['./quiz-interval-importance-scaling.component.sass'],
})
export class QuizIntervalImportanceScalingComponent implements OnInit {

  @Input()
  @Required()
  control ! : UntypedFormControl

  constructor() { }

  ngOnInit() {}
}
