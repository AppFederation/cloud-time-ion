import { Injectable } from '@angular/core';
import {LearnDoService} from '../learn-do.service'
import {LearnItem$} from '../search-or-add-learnable-item/search-or-add-learnable-item.page'

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private learnDoService: LearnDoService,
  ) {
    console.log(`QuizService learnDoService.itemsCount()`, this.learnDoService.itemsCount())
  }

  getNextItemForSelfRating(): LearnItem$ {
    console.log(`QuizService learnDoService.itemsCount()`, this.learnDoService.itemsCount())
    return null
  }
}
