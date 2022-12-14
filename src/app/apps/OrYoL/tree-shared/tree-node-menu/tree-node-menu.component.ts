import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OryTreeNode } from '../../tree-model/TreeModel'
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'
import { DialogService } from '../../core/dialog.service'
import { DbTreeService } from '../../tree-model/db-tree-service'
import {
  NgbModal,
  NgbPopover,
} from '@ng-bootstrap/ng-bootstrap'
import { ConfirmDeleteTreeNodeComponent } from '../confirm-delete-tree-node/confirm-delete-tree-node.component'
import { NodeContentComponent } from '../node-content/node-content.component'
import { Router } from '@angular/router'
import { ClipboardService } from '../../core/clipboard.service'

@Component({
  selector: 'app-tree-node-menu',
  templateUrl: './tree-node-menu.component.html',
  styleUrls: ['./tree-node-menu.component.sass']
})
export class TreeNodeMenuComponent implements OnInit {

  @Input() treeNode!: OryTreeNode

  @Input() treeHost!: TreeHostComponent

  @Input() nodeContentComponent!: NodeContentComponent

  // @Input() popOver!: NgbPopover

  constructor(
    public dialogService: DialogService,
    private modalService: NgbModal,
    public dbService: DbTreeService,
    public router: Router,
    public clipboardService: ClipboardService,
  ) { }

  ngOnInit() {
  }

  openDeleteConfirmationDialog() {
    // this.popOver.close()
    console.log('openDeleteConfirmationDialog()')
    // this.dialogService.showDeleteDialog(() => {
    //   // TODO: delete node inclusion and the node itself
    //   this.dbService.delete(this.treeNode.itemId)
    // })
    const modalRef = this.modalService.open(ConfirmDeleteTreeNodeComponent);
    const component = modalRef.componentInstance as ConfirmDeleteTreeNodeComponent
    component.treeNode = this.treeNode;
  }

  addChild() {
    // this.popOver.close()
    this.nodeContentComponent.addChild()
  }

  navigateInto() {
    console.log('navigateInto', this.treeNode)
    // this.router.navigate(['/tree', this.treeNode!.nodeInclusion!.nodeInclusionId /* note: inclusion id, because give item can be in multiple places */]);
    // FIXME: router.navigate might be causing problem with this sometimes working and sometimes not; maybe race condition?
    // maybe multiple instances of page component
    this.treeNode.navigateInto()
  }

  toClipboard() {
    this.clipboardService.setNodesInClipboard([this.treeNode])
    // this.popOver.close()
  }

  pasteCopyHereFromClipboard() {
    this.treeNode.addAssociationsHere(this.clipboardService.nodesInClipboard, undefined)
  }

  pasteMoveHereFromClipboard() {
    this.treeNode.moveInclusionsHere(this.clipboardService.nodesInClipboard, {beforeNode: undefined})
  }

  getWhenCreated() {
    let whenCreated = this.treeNode.itemData.whenCreated
    if ( whenCreated ) {
      whenCreated = whenCreated.toDate() // TODO: move this to FirestoreTimeStamper::onAfterLoadFromDb
    }
    return whenCreated
  }

}
