import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debugLog} from '../../../../libs/AppFedShared/utils/log'
import {LearnItem} from '../../models/LearnItem'
import {Observable} from 'rxjs/internal/Observable'
import {NumericPickerVal} from '../../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem$} from '../../models/LearnItem$'
import {QuizService} from '../../core/quiz.service'
import {Subscription} from 'rxjs/internal/Subscription'

@Component({
  selector: 'app-quiz-item-details',
  templateUrl: './quiz-item-details.component.html',
  styleUrls: ['./quiz-item-details.component.sass'],
})
export class QuizItemDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  item$ ? : LearnItem$ | null

  @Input()
  ionContent: any

  @ViewChild(`answers`) answersChild ! : ElementRef


  get itemVal$(): Observable<LearnItem | undefined | null> | undefined {
    return this.item$ ?. locallyVisibleChanges$
  }

  get showAnswer$() { return this.quizService.showAnswer$ }

  get showHint$() { return this.quizService.showHint$ }


  private subscriptionToShowAnswer ? : Subscription

  constructor(
    public quizService: QuizService,
  ) {
    debugLog('QuizItemDetailsComponent ctor')
  }

  ngOnInit() {
    this.quizService.onNewQuestion()
  }

  // private scrollToBottom() {
  //   // TODO: scroll to beginning of answer; as rate/next is gonna be in footer anyway
  //   setTimeout(() => {
  //     this.ionContent.scrollToBottom(300)
  //   }, 0)
  // }

  ngOnDestroy(): void {
    this.subscriptionToShowAnswer ?. unsubscribe()
  }

  ngAfterViewInit(): void {
    this.subscriptionToShowAnswer = this.quizService.showAnswer$.subscribe(showAnswer => {
      if ( showAnswer ) {
        setTimeout(() => {
          this.answersChild?.nativeElement?.scrollIntoView()
        }, 200)
      }
    })
  }
}
