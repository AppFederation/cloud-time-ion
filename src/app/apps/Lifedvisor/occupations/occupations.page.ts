import { Component, OnInit } from '@angular/core';
import {Dict, getDictionaryValuesAsArray, setIdsFromKeys} from '../../../utils/dictionary-utils';

/* make it more like "translation" instead of translator, to avoid fixed labels; and to widen the audience
better: activities (&occupations)?
*/
export class Occupations {
  'Travel' = {}
  Expatriate = {}
  'Language Learner' = {}
  YouTuber = {}
  Filmmaker = {}
  Programmer = {}
  'App Entrepreneur' = {}
  Manager = {} // delegation, etc.
  Employee = {}
  'Consultant / Freelancer' = {}
  'Writer' = {}
  'Copywriter' = {}
  'Blogger' = {}
  'Food Blogger' = {}
  'Graphic Designer' = {}
  'UI Designer' = {}
  'Frontend Development' = {}
  'Translation' = {}
  'Digital Nomad' = {}
  'Airbnb' = {}
  'Cooking' = {}
}

export const occupations = getDictionaryValuesAsArray(setIdsFromKeys(new Occupations() as any as Dict<{}>))

@Component({
  selector: 'app-occupations',
  templateUrl: './occupations.page.html',
  styleUrls: ['./occupations.page.scss'],
})
export class OccupationsPage implements OnInit {

  occupations = occupations

  constructor() { }

  ngOnInit() {
  }

}
