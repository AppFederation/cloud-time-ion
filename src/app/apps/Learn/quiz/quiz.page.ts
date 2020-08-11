import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {Observable} from 'rxjs/internal/Observable'
import {PopoverController} from '@ionic/angular'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {LearnItem$} from '../models/LearnItem$'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  item$: LearnItem$ | undefined

  dePrioritizeNewMaterial: boolean = true
  onlyWithQA = false

  get item$$(): Observable<LearnItem$ | undefined> {
    return this.quizService.getNextItemForSelfRating$(
      {
        dePrioritizeNewMaterial: this.dePrioritizeNewMaterial,
        onlyWithQA: this.onlyWithQA,
      }
    )
  }

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
