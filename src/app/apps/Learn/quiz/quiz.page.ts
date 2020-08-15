import { Component, OnInit } from '@angular/core';
import {QuizService, QuizStatus} from '../core/quiz.service'
import {Observable} from 'rxjs/internal/Observable'
import {PopoverController} from '@ionic/angular'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  item$: LearnItem$ | undefined


  showOptions = false

  status$ = this.quizService.getQuizStatus$()
    // debugLog(`get status$()`)

    // FIXME: this is being trigger many times
  // }

  constructor(
    public quizService: QuizService,
    public popoverController: PopoverController,
  ) {
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


  ngOnInit() {
  }

  nowMs() {
    return Date.now()
  }

  newDate(number: number) {
    return new Date(number)
  }

}
