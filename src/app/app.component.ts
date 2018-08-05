import { Component, ViewEncapsulation } from '@angular/core';
import {TreeNode, UITreeNode} from 'primeng/primeng'
import {FirestoreTreeService} from './shared/firestore-tree.service'
import { DialogService } from './core/dialog.service'

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {

  constructor(
    public dialogService: DialogService,
    // public dbService: FirestoreTreeService,
  ) {
    dialogService.deleteDialog$.subscribe((val) => {
      console.log('dialogService.deleteDialog$')
      $('#confirmDeleteButton').click(function(){
        window.alert('delete confirmed')
        val.callback()
      });
      $('#confirmDelete').modal('show');
    })

  }

}
