import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
} from '@angular/core';
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
export class AppComponent implements AfterViewInit {

  deleteCallback

  constructor(
    public dialogService: DialogService,
    // public dbService: FirestoreTreeService,
  ) {


    dialogService.deleteDialog$.subscribe((val) => {
      this.deleteCallback = val.callback
      console.log('dialogService.deleteDialog$', this.deleteCallback)
      $('#confirmDelete').modal('show');
    })

  }

  ngAfterViewInit(): void {
    $('#confirmDeleteButton').click(() => {
      // window.alert('delete confirmed')
      this.deleteCallback()
    });
  }

}
