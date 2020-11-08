import {Component, Input, OnInit} from '@angular/core';
import {Required} from '../../../../libs/AppFedShared/utils/angular/Required.decorator'
import {QuizService, QuizStatus} from '../../core/quiz.service'
import {LearnItem$} from '../../models/LearnItem$'
import {nullish} from '../../../../libs/AppFedShared/utils/type-utils'
import {ImportanceDescriptor, importanceDescriptors, importanceDescriptorsArray} from '../../models/fields/importance.model'

@Component({
  selector: 'app-quiz-items-left',
  templateUrl: './quiz-items-left.component.html',
  styleUrls: ['./quiz-items-left.component.sass'],
})
export class QuizItemsLeftComponent implements OnInit {

  importancesArray = importanceDescriptorsArray

  @Input() @Required()
  quizStatus ! : QuizStatus

  private itemDisplayed: LearnItem$ | nullish

  constructor(
    public quizService: QuizService
  ) { }

  ngOnInit() {
    this.quizService.nextItem$WhenRequested.subscribe(item => {
      this.itemDisplayed = item
    })
  }

  isCurrentDisplayed(importance: ImportanceDescriptor): boolean {
    return this.itemDisplayed ?. val ?. getEffectiveImportance() ?. id === importance?.id
    // return this.quizService.nextItem$WhenRequested.
  }
}
