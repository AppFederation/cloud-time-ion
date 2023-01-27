import {
  Component, Injector,
  Input,
  OnInit,
} from '@angular/core';
import { DebugService } from '../../core/debug.service'
import { TreeHostComponent } from '../tree-host/tree-host.component'
import { ConfigService } from '../../core/config.service'
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap'
import {PopoverController} from '@ionic/angular'
import {ToolbarPopoverComponent} from './toolbar-popover/toolbar-popover.component'
import {BaseComponent} from '../../../../libs/AppFedShared/base/base.component'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent extends BaseComponent implements OnInit {

  /* workaround for now */
  @Input() treeHost!: TreeHostComponent

  showExtraNavIcons = false

  constructor(
    public debugService: DebugService,
    public configService: ConfigService,
    // ngbPopoverConfig: NgbPopoverConfig,
    public popoverController: PopoverController,
    injector: Injector,
  ) {
    super(injector)
    // ngbPopoverConfig.placement = 'bottom-left' // 'right' // 'hover';
  }

  ngOnInit() {
  }

  async onClickMenuIcon($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: ToolbarPopoverComponent,
      event: $event,
      // translucent: true,
      // mode: 'ios',
      componentProps: {
        treeHost: this.treeHost,
      }
    });
    return await popover.present();

  }
}
