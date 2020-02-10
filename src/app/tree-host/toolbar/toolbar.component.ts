import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DebugService } from '../../core/debug.service'
import { TreeHostComponent } from '../tree-host/tree-host.component'
import { ConfigService } from '../../core/config.service'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnInit {

  /* workaround for now */
  @Input() treeHost: TreeHostComponent

  constructor(
    public debugService: DebugService,
    public configService: ConfigService,
  ) { }

  ngOnInit() {
  }

}
