import {Component, Injector, Input, OnInit} from '@angular/core';
import {BaseComponent} from '../base/base.component'
import {OdmItem$2} from '../odm/OdmItem$2'
import {stripHtml} from '../utils/html-utils'
import {LearnItem$} from '../../../apps/Learn/models/LearnItem$'
import {BehaviorSubject} from 'rxjs'

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.sass'],
})
export class BreadcrumbsComponent extends BaseComponent implements OnInit {

  stripHtml = stripHtml

  @Input()
  item$ !: OdmItem$2<any, any, any, any>

  ancestorsPath$!: BehaviorSubject<LearnItem$[]>

  constructor(
    injector: Injector,
  ) {
    super(injector)

    // TODO: item.getPath() -- then ngFor on the path elements
  }

  ngOnInit() {
    this.ancestorsPath$ = this.item$.getAncestorsPath$()
  }

}
