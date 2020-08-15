import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-options',
  templateUrl: './quiz-options.component.html',
  styleUrls: ['./quiz-options.component.sass'],
})
export class QuizOptionsComponent implements OnInit {

  dePrioritizeNewMaterial: boolean = false

  onlyWithQA = true


  constructor() { }

  ngOnInit() {}

}
