import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms'
import {stripHtml} from '../../../../../libs/AppFedShared/utils/html-utils'

@Component({
  selector: 'app-quiz-answer-revealer',
  templateUrl: './quiz-answer-revealer.component.html',
  styleUrls: ['./quiz-answer-revealer.component.scss'],
})
export class QuizAnswerRevealerComponent implements OnInit {

  @Input()
  revealCharactersCount = 0

  @Input()
  formControl1 ! : FormControl<string>


  constructor() { }

  ngOnInit() {}

  getValue() {
    return stripHtml(this.formControl1.value)?.trim()?.substring(0, this.revealCharactersCount)
  }

  onClickReveal() {
    this.revealCharactersCount ++
  }
}
