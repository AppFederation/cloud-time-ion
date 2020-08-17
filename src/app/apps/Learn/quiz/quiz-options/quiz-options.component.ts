import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {QuizOptions, QuizService} from '../../core/quiz.service'

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.sass'],
})
export class QuizOptionsComponent implements OnInit {

  /* TODO use some options syncer util, maybe OptionsFormControl directive */
  controls = {
    dePrioritizeNewMaterial: new FormControl(false),
    onlyWithQA: new FormControl(true),
  }

  formGroup = new FormGroup(this.controls)

  constructor(
    public quizService: QuizService
  ) {
    this.formGroup.valueChanges.subscribe((options: QuizOptions) => {
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
