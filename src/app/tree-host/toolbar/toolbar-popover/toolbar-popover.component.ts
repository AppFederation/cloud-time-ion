import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeHostComponent } from '../../tree-host/tree-host.component'
import { DebugService } from '../../../core/debug.service'
import { ConfigService } from '../../../core/config.service'

@Component({
  selector: 'app-toolbar-popover',
  templateUrl: './toolbar-popover.component.html',
  styleUrls: ['./toolbar-popover.component.sass']
})
export class ToolbarPopoverComponent implements OnInit {

  /* workaround for now */
  @Input() treeHost: TreeHostComponent

  constructor(
    public debugService: DebugService,
    public configService: ConfigService,
  ) { }

  ngOnInit() {
  }

}
