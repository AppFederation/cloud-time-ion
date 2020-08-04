import { Component, OnInit } from '@angular/core';
import {QuizService} from '../core/quiz.service'
import {sidesDefs, sidesDefsArray} from '../core/sidesDefs'
import {map, switchMap} from 'rxjs/operators'
import {NumericPickerVal} from '../../../libs/AppFedSharedIonic/ratings/numeric-picker/numeric-picker.component'
import {LearnItem, LearnItem$} from '../models/LearnItem'
import {Observable} from 'rxjs/internal/Observable'
import {nullish} from '../../../libs/AppFedShared/utils/utils'
import {PopoverController} from '@ionic/angular'
import {SyncPopoverComponent} from '../../../libs/AppFedShared/odm/sync-status/sync-popover/sync-popover.component'
import {QuizTimerPopoverComponent} from './quiz-timer-popover/quiz-timer-popover.component'
import {FormControl, FormGroup} from '@angular/forms'
import {mapFieldsToFormControls} from '../../../libs/AppFedShared/utils/dictionary-utils'
import {ViewSyncer} from '../../../libs/AppFedShared/odm/ui/ViewSyncer'


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.sass'],
})
export class QuizPage implements OnInit {

  public shouldShowAnswer = false
  dummyArray = [{}]

  selfRating: NumericPickerVal | undefined = undefined

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

  tinyMceInit = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    skin: 'oxide-dark',
    content_css: 'dark',  // > **Note**: This feature is only available for TinyMCE 5.1 and later.,
    entity_encoding: `raw` /* https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@entity_encoding/ */,
  }

  formControls ? : { [ key: string] : FormControl /* TODO: mapped type */ }
  formGroup ? : FormGroup

  public viewSyncer ? : ViewSyncer


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

  getSideValForQuiz$() {
    // FIXME: ! keep in mind this could be called multiple times due to change detection !
    return this.item$$.pipe(map(item$ => {
      if ( this.item$ !== item$ ) {
        console.log(`getSideValForQuiz$ new item$`)
        setTimeout(() => {
          this.reset()
        })
      }
      this.item$ = item$ // could be race condition?
      if ( item$ && ! this.viewSyncer ) {
        this.formControls = mapFieldsToFormControls(sidesDefs)
        this.formGroup = new FormGroup(this.formControls !)
        this.viewSyncer = new ViewSyncer(this.formGroup /* FIXME: replace with item-side component, for patching individual fields */, item$)
      }
        //   this.item$ = item$
        //   // FIXME: this should improve a lot when I emit entire array changed (newly arrived), instead of each onAdded
        // })
        // console.log(`getSideValForQuiz$ this.item$$.pipe`)
        if ( ! item$ ) {
          return '(Loading...)'
        }
        const item = item$.currentVal
        if ( ! item ) {
          return '(none)'
        }
        return item.getQuestionOrAnyString()
      // }
    }))
  }

  nowMs() {
    return Date.now()
  }

  newDate(number: number) {
    return new Date(number)
  }

  showAnswer() {
    this.shouldShowAnswer = ! this.shouldShowAnswer
  }

  // onChangeSelfRating($event: NumericPickerVal) {
  // }
  applyAndNext() {
    this.reset()

    this.item$ ?. setNewSelfRating(this.selfRating !)
  }

  private reset() {
    this.shouldShowAnswer = false
    this.dummyArray = [{}]
  }
}
