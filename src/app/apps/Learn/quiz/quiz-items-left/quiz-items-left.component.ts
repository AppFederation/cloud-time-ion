import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {QuizStatus} from '../../core/quiz.service'
import {importanceDescriptors, importanceDescriptorsArray} from '../../models/LearnItem'

@Component({
  selector: 'app-quiz-items-left',
  templateUrl: './quiz-items-left.component.html',
  styleUrls: ['./quiz-items-left.component.sass'],
})
export class QuizItemsLeftComponent implements OnInit {

  importancesArray = importanceDescriptorsArray

  @Input() @Required()
  quizStatus ! : QuizStatus

  constructor() { }

  ngOnInit() {}

}
