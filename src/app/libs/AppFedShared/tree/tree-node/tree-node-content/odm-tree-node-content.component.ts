import {Component, Input, OnInit} from '@angular/core';
import {OdmCell} from '../../cells/OdmCell'
import {OdmTreeNode} from '../OdmTreeNode'
import {cellDirections, CellNavigationService} from '../../../cell-navigation.service'
import {LearnItem} from '../../../../../apps/Learn/models/LearnItem'
import {CachedSubject} from '../../../utils/cachedSubject2/CachedSubject2'
import {getDictionaryValuesAsArray, setIdsFromKeys} from '../../../utils/dictionary-utils'
import {PopoverController} from '@ionic/angular'
import {TreeNodeMenuPopoverComponent} from '../../../../../apps/OrYoL/tree-shared/tree-node-menu/tree-node-menu-popover.component'
import {OdmTreeNodePopupComponent} from '../odm-tree-node-popup/odm-tree-node-popup.component'


export function column(colDesc: any) {
  return colDesc
}
// for (let i of range(0, 10000)) {
// for (let i = 0; i < 10000; i++) {

@Component({
  selector: 'app-tree-node-content',
  templateUrl: './odm-tree-node-content.component.html',
  styleUrls: ['./odm-tree-node-content.component.sass'],
})
export class OdmTreeNodeContentComponent implements OnInit {

  @Input()
  treeNode !: OdmTreeNode

  val$!: CachedSubject<LearnItem>

  mapColumnIdToCell!: Map<string, OdmCell>

  showAnswer = false

  columnsDict = setIdsFromKeys({
    // /** or durationEstimate */
    // estimatedTime: column({
    //   type: 'minMidMax'
    // }),
    // timeTracking: column({
    //   type: 'timeTracking'
    // }),
    title: column({
      type: 'richText',
      flexGrow: 1,
    }),
    answer: column({
      type: 'richText',
      flexGrow: 2,
    })
  })

  columns = getDictionaryValuesAsArray(this.columnsDict)

  cells!: OdmCell<any>[]

  constructor(
    public cellNavigationService: CellNavigationService,
    public popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.val$ = this.treeNode.item$.val$
    this.mapColumnIdToCell = new Map<string, OdmCell>()
    this.cells = this.columns.map(column => {
      const cell = new OdmCell(this.treeNode, column)
      this.mapColumnIdToCell.set(column.id, cell)
      return cell
    })
  }

  onArrowLeft() {
    // this.cellNavigationService.navigateToCellVisuallyInDirection(cellDirections.left)
  }

  async onClickClassIcon($event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: OdmTreeNodePopupComponent,
      componentProps: {
        treeNode: this.treeNode,
        // treeHost: this.treeHost,
        nodeContentComponent: this,
      },
      event: $event,
      translucent: true,
      mode: 'ios',
    });
    return await popover.present();
  }
}
