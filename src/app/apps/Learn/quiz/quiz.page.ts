import {AfterViewInit, Component, OnInit} from '@angular/core';
import {QuizService, QuizStatus} from '../core/quiz/quiz.service'
import {Observable} from 'rxjs'
import {PopoverController} from '@ionic/angular'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {Subject} from 'rxjs/internal/Subject'
import {map, withLatestFrom} from 'rxjs/operators'
import {EditorService} from '../../../libs/AppFedShared/rich-text/rich-text-edit/editor.service'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'
import {isNullish} from '../../../libs/AppFedShared/utils/utils'
import {BaseComponent} from '../../../libs/AppFedShared/base/base.component'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage extends BaseComponent implements OnInit, AfterViewInit  {

  item$: LearnItem$ | undefined


  // showOptions = true
  showOptions = false

  status$ = this.quizService.quizStatus$

  nextItem$WhenRequested = this.quizService.nextItem$WhenRequested

  constructor(
    public quizService: QuizService,
    public popoverController: PopoverController,
    public editorService: EditorService,
  ) {
    super()
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.quizService.requestNextItem()
  }

  async onClickTimer(event: any) {
    const popover = await this.popoverController.create({
      component: QuizTimerPopoverComponent,
      event: event,
      translucent: true,
      mode: 'ios' /* TODO */,
    });
    return await popover.present();
  }

  nowMs() {
    return Date.now()
  }

  newDate(number: number | nullish) {
    if ( isNullish(number) ) {
      return number
    }
    return new Date(number)
  }

}
