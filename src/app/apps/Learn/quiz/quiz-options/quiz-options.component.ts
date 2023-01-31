import { Component, OnInit } from '@angular/core';
import {Form, UntypedFormControl, UntypedFormGroup} from '@angular/forms'
import {QuizOptions, QuizService} from '../../core/quiz/quiz.service'
import {ViewSyncer} from '../../../../libs/AppFedShared/odm/ui/ViewSyncer'
import {OptionsService} from '../../core/options.service'
import {throttleTimeWithLeadingTrailing_ReallyThrottle} from '../../../../libs/AppFedShared/utils/rxUtils'
import {buttonsDesc} from '../../../../libs/LifeSuiteShared/edit-shared/fun-level-edit/fun-level-edit.component'

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.sass'],
})
export class QuizOptionsComponent implements OnInit {

  funButtonsDesc = buttonsDesc

  /* TODO use some options syncer util, maybe OptionsFormControl directive */
  controls: { [k in keyof QuizOptions]: UntypedFormControl} = {
    dePrioritizeNewMaterial: new UntypedFormControl(false),
    onlyWithQA: new UntypedFormControl(true),
    skipTasks: new UntypedFormControl(true),
    powBaseX100: new UntypedFormControl(),
    scaleIntervalsByImportance: new UntypedFormControl(1),
    focusLevelProbabilities: new UntypedFormControl(1),
    categories: new UntypedFormControl(''),
    textFilter: new UntypedFormControl(''),
    minFunLevel: new UntypedFormControl(),
  }

  formGroup = new UntypedFormGroup(this.controls)

  viewSyncer = new ViewSyncer(this.formGroup, this.quizService.options2$, false,
    'powBaseX100' /* FIXME why just 1 field */)

  constructor(
    public quizService: QuizService,
    public optionsService: OptionsService,
  ) {
    this.controls.minFunLevel.valueChanges.subscribe(v => {
      console.log('minfun', v)
      console.log('minfun val', this.controls.minFunLevel.value)
      console.log('grp val', this.formGroup.value)
    })
    this.formGroup.valueChanges.subscribe(v => console.log('formGroup valueChanges', v))
    this.formGroup.valueChanges.pipe(
      throttleTimeWithLeadingTrailing_ReallyThrottle(200)
    ).subscribe((options: QuizOptions) => {
      console.log('quiz options', options)
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
