import { Component, OnInit } from '@angular/core';
import {Form, FormControl, FormGroup} from '@angular/forms'
import {QuizOptions, QuizService} from '../../core/quiz/quiz.service'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {OptionsService} from '../../core/options.service'
import {throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../../libs/AppFedShared/utils/rxUtils'

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.sass'],
})
export class QuizOptionsComponent implements OnInit {

  /* TODO use some options syncer util, maybe OptionsFormControl directive */
  controls: { [k in keyof QuizOptions]: FormControl} = {
    dePrioritizeNewMaterial: new FormControl(false),
    onlyWithQA: new FormControl(true),
    skipTasks: new FormControl(true),
    powBaseX100: new FormControl(),
    scaleIntervalsByImportance: new FormControl(1),
    categories: new FormControl('')
  }

  formGroup = new FormGroup(this.controls)

  viewSyncer = new ViewSyncer(this.formGroup, this.quizService.options2$, false,
    'powBaseX100' /* FIXME why just 1 field */)

  constructor(
    public quizService: QuizService,
    public optionsService: OptionsService,
  ) {
    this.formGroup.valueChanges.pipe(
      throttleTimeWithLeadingTrailing_ReallyThrottle(200)
    ).subscribe((options: QuizOptions) => {
      this.quizService.setOptions(options)
    })
    // this.formGroup.setValue({
    //   dePrioritizeNewMaterial: false,
    //   onlyWithQA: true,
    // })
    // this.quizService.options$.subscribe (TODO 2-way binding)
  }

  ngOnInit() {}

}
