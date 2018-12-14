import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../../shared/TreeModel'
import { TreeHostComponent } from '../tree-host/tree-host.component'
import { DialogService } from '../../core/dialog.service'
import { DbTreeService } from '../../shared/db-tree-service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ConfirmDeleteTreeNodeComponent } from '../confirm-delete-tree-node/confirm-delete-tree-node.component'
import { NodeContentComponent } from '../node-content/node-content.component'

@Component({
  selector: 'app-tree-node-menu',
  templateUrl: './tree-node-menu.component.html',
  styleUrls: ['./tree-node-menu.component.scss']
})
export class TreeNodeMenuComponent implements OnInit {

  @Input() treeNode: OryTreeNode

  @Input() treeHost: TreeHostComponent

  @Input() nodeContentComponent: NodeContentComponent

  constructor(
    public dialogService: DialogService,
    private modalService: NgbModal,
    public dbService: DbTreeService,
  ) { }

  ngOnInit() {
  }

  openDeleteConfirmationDialog() {
    console.log('delete()')
    // this.dialogService.showDeleteDialog(() => {
    //   // TODO: delete node inclusion and the node itself
    //   this.dbService.delete(this.treeNode.itemId)
    // })
    const modalRef = this.modalService.open(ConfirmDeleteTreeNodeComponent);
    const component = modalRef.componentInstance as ConfirmDeleteTreeNodeComponent
    component.treeNode = this.treeNode;
  }

}
