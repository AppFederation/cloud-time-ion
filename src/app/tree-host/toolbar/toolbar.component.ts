import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DebugService } from '../../core/debug.service'
import { TreeHostComponent } from '../tree-host/tree-host.component'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  /* workaround for now */
  @Input() treeHost: TreeHostComponent

  constructor(
    public debugService: DebugService
  ) { }

  ngOnInit() {
  }

}
