import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[listType]'
})
export class ListTypeDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
