import {Component, Input, OnInit} from '@angular/core';
import {OdmCell} from '../../cells/OdmCell'
import {TreeNode} from '../TreeNode'
import {cellDirections, CellNavigationService} from '../../../cell-navigation.service'
import {LearnItem} from '../../../../../apps/Learn/models/LearnItem'
import {CachedSubject} from '../../../utils/cachedSubject2/CachedSubject2'

@Component({
  selector: 'app-tree-node-content',
  templateUrl: './tree-node-content.component.html',
  styleUrls: ['./tree-node-content.component.sass'],
})
export class TreeNodeContentComponent implements OnInit {

  @Input()
  treeNode !: TreeNode

  val$!: CachedSubject<LearnItem>

  constructor(
    public cellNavigationService: CellNavigationService
  ) { }

  ngOnInit() {
    this.val$ = this.treeNode.item$.val$
  }

  onArrowLeft() {
    // this.cellNavigationService.navigateToCellVisuallyInDirection(cellDirections.left)
  }
}
