import {Component, Input, OnInit} from '@angular/core';
import {OdmCell} from '../../cells/OdmCell'
import {TreeNode} from '../TreeNode'
import {cellDirections, CellNavigationService} from '../../../cell-navigation.service'

@Component({
  selector: 'app-tree-node-content',
  templateUrl: './tree-node-content.component.html',
  styleUrls: ['./tree-node-content.component.sass'],
})
export class TreeNodeContentComponent implements OnInit {

  @Input()
  treeNode !: TreeNode

  constructor(
    public cellNavigationService: CellNavigationService
  ) { }

  ngOnInit() {
  }

  onArrowLeft() {
    this.cellNavigationService.navigateToCellVisuallyInDirection(cellDirections.left)
  }
}
