import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TreeHostComponent } from '../../tree-host/tree-host/tree-host.component'
import { DialogService } from '../../core/dialog.service'
import { DbTreeService } from '../../tree-model/db-tree-service'
// import {
//   NgbModal,
//   NgbPopover,
// } from '@ng-bootstrap/ng-bootstrap'
import { ConfirmDeleteTreeNodeComponent } from '../confirm-delete-tree-node/confirm-delete-tree-node.component'
import { NodeContentComponent } from '../node-content/node-content.component'
import { Router } from '@angular/router'
import { ClipboardService } from '../../core/clipboard.service'
import {AlertController, PopoverController} from '@ionic/angular'
import {INodeContentComponent} from '../node-content/INodeContentComponent'

import {OryBaseTreeNode, OryNonRootTreeNode} from '../../tree-model/TreeModel'
import {ApfNonRootTreeNode} from '../../tree-model/TreeNode'


@Component({
  selector: 'app-tree-node-menu-popover',
  templateUrl: './tree-node-menu-popover.component.html',
  styleUrls: ['./tree-node-menu-popover.component.sass']
})
export class TreeNodeMenuPopoverComponent implements OnInit {

  @Input() treeNode!: OryBaseTreeNode

  @Input() treeHost!: TreeHostComponent

  @Input() nodeContentComponent!: INodeContentComponent

  // @Input() popOver!: NgbPopover

  constructor(
    public dialogService: DialogService,
    // private modalService: NgbModal,
    public dbService: DbTreeService,
    public router: Router,
    public clipboardService: ClipboardService,
    public popoverController: PopoverController,
    public alertController: AlertController,
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
    // const modalRef = this.modalService.open(ConfirmDeleteTreeNodeComponent);
    // const component = modalRef.componentInstance as ConfirmDeleteTreeNodeComponent
    // component.treeNode = this.treeNode;
  }

  async addChild() {
    // this.popOver.close()
    // this.treeNode.addChild()
    this.nodeContentComponent.addChild()
    await this.popoverController.dismiss()
  }

  navigateInto() {
    console.log('navigateInto', this.treeNode)
    // this.router.navigate(['/tree', this.treeNode!.nodeInclusion!.nodeInclusionId
    // /* note: inclusion id, because give item can be in multiple places */]);
    // FIXME: router.navigate might be causing problem with this sometimes working and sometimes not; maybe race condition?
    // maybe multiple instances of page component
    this.treeNode.navigateInto()
  }

  toClipboard() {
    this.clipboardService.setNodesInClipboard([this.treeNode])
    // this.popOver.close()
  }

  pasteCopyHereFromClipboard() {
    this.treeNode.addAssociationsHere(this.clipboardService.nodesInClipboard as any, undefined)
  }

  pasteMoveHereFromClipboard() {
    this.treeNode.moveInclusionsHere(this.clipboardService.nodesInClipboard as any, {beforeNode: undefined})
  }

  getWhenCreated() {
    let whenCreated = this.treeNode.content.itemData.whenCreated
    if ( whenCreated ) {
      whenCreated = whenCreated.toDate() // TODO: move this to FirestoreTimeStamper::onAfterLoadFromDb
    }
    return whenCreated
  }


  async askArchiveItems() {
    // TODO what sub-items are not yet loaded (could archive parent without children)
    const count = this.treeNode.countSubItemsIncludingThis()
    // const count = this.treeNode.treeModel.root.countSubItemsIncludingThis()
    console.log('count to archive', count)

    const alert = await this.alertController.create({
      header: `Archive ${count} item(s)?`,
      // message: 'Delete <strong>' + this.item$ ?. currentVal ?. joinedSides ?. () + '</strong>!!!?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'ARCHIVE',
          handler: async () => {
            this.treeNode.callRecursivelyIncludingThisNode((node: OryNonRootTreeNode) => {
              node.content.patchThrottled({
                isArchived: true,
                isArchivedWhen: new Date(),
              })
              node.nodeInclusion$?.patchThrottled({
                isArchived: true,
                isArchivedWhen: new Date(),
              })

            }) /* TODO depth-first calling, to preserve invariant that parents always exist */
            // this.doc.update({
            //   whenDeleted: new Date(),
            // })
            // await this.doc.delete() // TODO: listen to promise for sync status
            // await this.angularFirestore.collection(`LearnDoAudio`).doc(this.id).delete() // TODO: listen to promise for sync status
            // ignorePromise(this.router.navigate([`/learn`]))
          }
        }
      ]
    })
    await alert.present()
  }

}
