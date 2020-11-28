import {Component, Input, OnInit, Output} from '@angular/core';
import {Required} from '../../utils/angular/Required.decorator'
import {CachedSubject} from '../../utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-chooser',
  templateUrl: './chooser.component.html',
  styleUrls: ['./chooser.component.sass'],
})
export class ChooserComponent<TChoosable extends any = any> implements OnInit {

  @Required()
  @Input()
  allPossible: TChoosable[] = ['a', 'B'] as TChoosable[]

  @Output()
  chosen = new CachedSubject<TChoosable[]>([])

  constructor() { }

  ngOnInit() {}

  onClick(choosableClicked: TChoosable) {
    this.chosen.next(
      [...this.chosen.lastVal !, choosableClicked]
    )
  }

  isChosen(choosable: TChoosable) {
    return this.chosen.lastVal?.includes(choosable)
  }

  getTitle(choosable: any) {
    return choosable ?. title
      ?? choosable ?. name
      ?? choosable ?. id
      ?? choosable
  }
}
