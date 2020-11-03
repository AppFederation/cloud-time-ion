import {AfterViewInit, Component, OnInit} from '@angular/core';
import {QuizService, QuizStatus} from '../core/quiz.service'
import {Observable} from 'rxjs'
import {PopoverController} from '@ionic/angular'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {LearnItem$} from '../models/LearnItem$'
import {debugLog} from '../../../libs/AppFedShared/utils/log'
import {Subject} from 'rxjs/internal/Subject'
import {map, withLatestFrom} from 'rxjs/operators'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit, AfterViewInit  {

  item$: LearnItem$ | undefined


  showOptions = false

  status$ = this.quizService.quizStatus$

  nextItem$WhenRequested = this.quizService.nextItem$WhenRequested

  constructor(
    public quizService: QuizService,
    public popoverController: PopoverController,
  ) {
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

  newDate(number: number) {
    return new Date(number)
  }

}
