import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { DialogService } from './core/dialog.service'
import { SearchService } from './core/search.service'

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
    public searchService: SearchService /* to ensure it gets created to get results */,
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
