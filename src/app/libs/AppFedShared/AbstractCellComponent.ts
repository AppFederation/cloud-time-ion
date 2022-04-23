import {ElementRef, Injector, Input, OnDestroy, OnInit} from '@angular/core'
import {CellNavigationService} from './cell-navigation.service'
import {OdmCell} from './tree/cells/OdmCell'

export abstract class AbstractCellComponent implements OnInit, OnDestroy {

  @Input()
  public cell: OdmCell = new OdmCell() /* FIXME: dummy */

  public cellNavigationService = this.injector.get(CellNavigationService)

  public elementRef = this.injector.get(ElementRef)

  get viewportTop() {
    return this.elementRef.nativeElement.getBoundingClientRect().viewportTop
  }


  constructor(
    protected injector: Injector,
  ) {

  }

  ngOnInit(): void {
    this.cellNavigationService.register(this)
  }

  ngOnDestroy(): void {
    this.cellNavigationService.deregister(this)
  }

  abstract focus(): void

}
