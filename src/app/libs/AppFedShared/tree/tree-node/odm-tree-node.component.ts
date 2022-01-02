import {Component, Input, OnInit} from '@angular/core';
import {TreeNode} from './TreeNode'
import {OdmItem$2} from '../../odm/OdmItem$2'
import {OdmService2} from '../../odm/OdmService2'
import {AuthService} from '../../../../auth/auth.service'

@Component({
  selector: 'app-tree-node',
  templateUrl: './odm-tree-node.component.html',
  styleUrls: ['./odm-tree-node.component.css']
})
export class OdmTreeNodeComponent implements OnInit {

  expanded = true

  @Input()
  treeNode!: TreeNode<OdmItem$2<any, any, any, any>>

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    // this.authService.authUser$.subscribe((user) => {
    //   console.log(`user`, user)
    //   if ( user ) {
        this.treeNode.requestLoadChildren()
    //   }
    // })
  }

  addChild() {
    const item$ = this.treeNode.item$
    const odmService = item$.odmService as OdmService2<any, any, any, any>
    const newItem = odmService.newItem(undefined, {}, [item$])
    newItem.saveNowToDb()
    console.log('newItem', newItem)
  }

  trackById(index: number, node: TreeNode) {
    return node.item$.id
  }
}
