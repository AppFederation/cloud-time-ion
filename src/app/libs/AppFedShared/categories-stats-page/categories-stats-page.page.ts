import { Component, OnInit } from '@angular/core';
import {LearnItem$} from '../../../apps/Learn/models/LearnItem$'
import {HtmlString} from '../../../apps/Learn/models/LearnItem'
import {stripHtml} from '../utils/html-utils'
import {LearnItemItemsService} from '../../../apps/Learn/core/learn-item-items.service'

@Component({
  selector: 'app-categories-stats-page',
  templateUrl: './categories-stats-page.page.html',
  styleUrls: ['./categories-stats-page.page.sass'],
})
export class CategoriesStatsPagePage implements OnInit {

  text = ''
  count = 0

  constructor(
    public learnDoService: LearnItemItemsService,
  ) {
    this.learnDoService.localItems$.subscribe((item$s: LearnItem$[]) => {
      this.analyzeCategories(item$s)
    })
  }

  private analyzeCategories(item$s: LearnItem$[]) {
    const set = new Set<HtmlString>()
    const mapToCount = new Map<HtmlString, number>()
    for (let item$ of item$s) {
      const cats = item$.val?.categories
      // const cats = item$.val?.getQuestion()
      if (cats) {
        // console.log('category', cats)
        const categoryNames = stripHtml(cats) || '' // could move this to LearnItem$::getCategoryNames, getCategoryWords
        categoryNames.split(/,|->|#|\W+/gi).forEach(categoryName => {
          // TODO: also extract keywords
          const catNameNormalized = categoryName.trim().toLowerCase()
          console.log('catNameNormalized', catNameNormalized)
          set.add(catNameNormalized)
          mapToCount.set(catNameNormalized, (mapToCount.get(catNameNormalized) || 0) + 1)
        })
      }
    }
    this.text = ''
    // ;[...(set.values())].sort().forEach(c => {
    ;[...(mapToCount.entries())].sort((s1, s2) => s2[1] - s1[1]).forEach(entry => {
      this.text += entry[1] + ' -- ' + entry[0] + '\n'
    })
    // TODO: stripHtml
    // TODO: split on comma and newline and trim
    // toLowerCase, sort, unique
    console.log('analyzeCategories set', set)
    this.count = set.size
    // this.text = '' + set
  }

  ngOnInit() {
  }

}
