import { Component, OnInit } from '@angular/core';
import {TreeNode} from 'primeng/api'
import {NodeService} from './node.service'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass'],
})
export class CategoriesComponent implements OnInit {

  files1!: TreeNode[];

  files2!: TreeNode[];

  files3!: TreeNode[];

  files4!: TreeNode[];

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.nodeService.getFiles().then(files => this.files1 = files);
    this.nodeService.getFiles().then(files => this.files2 = files);
    this.files3 = [{
      label: "Backup",
      data: "Backup Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder"
    }
    ];

    this.files4 = [{
      label: "Storage",
      data: "Storage Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder"
    }
    ];
  }
}
