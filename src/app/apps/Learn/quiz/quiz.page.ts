import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {map, switchMap} from 'rxjs/operators'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {Observable} from 'rxjs/internal/Observable'
import {PopoverController} from '@ionic/angular'
import {SyncPopoverComponent} from '../../../libs/AppFedShared/odm/sync-status/sync-popover/sync-popover.component'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {FormControl, FormGroup} from '@angular/forms'
import {mapFieldsToFormControls} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {ViewSyncer} from '../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {nullish} from '../../../libs/AppFedShared/utils/type-utils'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  item$: LearnItem$ | undefined

  get itemVal$(): Observable<LearnItem | nullish> {
    return this.item$$.pipe(
      switchMap(item$ => {
        return item$ ?. locallyVisibleChanges$ !
      })
    )
  }

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

  // getQuestionValForQuiz$() {
  //   // FIXME: ! keep in mind this could be called multiple times due to change detection !
  //   return this.item$$.pipe(map(item$ => {
  //     if ( this.item$ !== item$ ) {
  //       console.log(`getSideValForQuiz$ new item$`)
  //       setTimeout(() => {
  //         // this.reset()
  //       })
  //     }
  //     this.item$ = item$ // could be race condition?
  //     if ( item$ && ! this.viewSyncer ) {
  //       this.formControls = mapFieldsToFormControls(sidesDefs)
  //       this.formGroup = new FormGroup(this.formControls !)
  //       this.viewSyncer = new ViewSyncer(this.formGroup /* FIXME: replace with item-side component, for patching individual fields */, item$)
  //     }
  //       //   this.item$ = item$
  //       //   // FIXME: this should improve a lot when I emit entire array changed (newly arrived), instead of each onAdded
  //       // })
  //       // console.log(`getSideValForQuiz$ this.item$$.pipe`)
  //       if ( ! item$ ) {
  //         return '(Loading...)'
  //       }
  //       const item = item$.currentVal
  //       if ( ! item ) {
  //         return '(none)'
  //       }
  //       return item.getQuestionOrAnyString()
  //     // }
  //   }))
  // }

  nowMs() {
    return Date.now()
  }

  newDate(number: number) {
    return new Date(number)
  }

}
