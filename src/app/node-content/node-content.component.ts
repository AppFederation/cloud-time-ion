import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {DbService} from '../db.service'
import {TreeNode} from 'primeng/primeng'

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.scss'],
})
export class NodeContentComponent implements OnInit, AfterViewInit {

  @Input() node: TreeNode & {dbId: string}
  // @Input() node2
  @ViewChild('input') inputEl: ElementRef;
  // https://stackoverflow.com/questions/44479457/angular-2-4-set-focus-on-input-element

  constructor(
    public dbService: DbService,
  ) { }

  ngOnInit() {
    console.log(this.node)
    // console.log('n2', this.node2)
  }

  focusInput() {
    this.inputEl.nativeElement.focus()
  }

  ngAfterViewInit(): void {
   this.focusInput()
  }

  delete() {
    this.dbService.delete(this.node.dbId)
  }

  addChild() {
    this.addChildToDb()
    // if ( ! this.node.children ) {
    //   this.node.children = []
    // }
    // this.node.children.push({
    //   label: 'new child'
    // })
  }

  private addChildToDb() {
    this.dbService.addNode(this.node.dbId)
  }

}
