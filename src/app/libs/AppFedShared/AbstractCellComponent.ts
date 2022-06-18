import {ElementRef, Injectable, Injector, Input, OnDestroy, OnInit} from '@angular/core'
import {CellNavigationService} from './cell-navigation.service'
import {OdmCell} from './tree/cells/OdmCell'

@Injectable()
export abstract class AbstractCellComponent implements OnInit, OnDestroy {

  @Input()
  public cell: OdmCell = new OdmCell() /* FIXME: dummy */

  public cellNavigationService = this.injector.get(CellNavigationService)

  public elementRef = this.injector.get(ElementRef)

  get viewportTop() {
    return this.elementRef.nativeElement.getBoundingClientRect().top
  }


  constructor(
    protected injector: Injector,
  ) {

  }

  /* override */ ngOnInit(): void {
    this.cellNavigationService.register(this)
  }

  /* override */ ngOnDestroy(): void {
    this.cellNavigationService.deregister(this)
  }

  abstract focus(): void

}
