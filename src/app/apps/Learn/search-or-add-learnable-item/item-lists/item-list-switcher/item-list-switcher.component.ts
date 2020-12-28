import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {LearnItem$} from '../../../models/LearnItem$'
import {LocalDebugOptionsService} from '../../../core/local-debug-options.service'
import {ListTypeDirective} from './list-type.directive'
import {ItemListInterface} from '../item-list-interface'
import {DisplayList} from '../../../../../libs/AppFedShared/options/display-list-options/display-list'

@Component({
  selector: 'item-list-switcher',
  templateUrl: './item-list-switcher.component.html',
  styleUrls: ['./item-list-switcher.component.sass'],
})
export class ItemListSwitcherComponent implements OnInit, ItemListInterface {

  @Input()
  items: LearnItem$[] | undefined;

  @ViewChild(ListTypeDirective, {static: true})
  listType: ListTypeDirective;

  currentDisplayList: DisplayList;

  constructor(private localDebugOptionsService: LocalDebugOptionsService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.localDebugOptionsService.displayList$.subscribe(displayList => {
      this.currentDisplayList = displayList;
      this.reloadList(displayList)
    });

    this.localDebugOptionsService.generatedData$.subscribe(() => this.reloadList(this.currentDisplayList))
  }

  private reloadList(displayList: DisplayList) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(displayList.component);
    const viewContainerRef = this.listType.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<ItemListInterface>(componentFactory);
    componentRef.instance.items = this.items;
  }
}
