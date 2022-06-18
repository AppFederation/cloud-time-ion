import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SearchService } from '../../core/search.service'
import { NavigationService } from '../../core/navigation.service'


zzz
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, AfterViewInit {
  // searchText: string
  textFieldDummy
  filteredNodes = []

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef

  constructor(
    public searchService: SearchService,
    public navigationService: NavigationService,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    console.log('SearchComponent ngOnInit()')
    this.searchInput.nativeElement.focus()
  }

  searchText($event: Event) {
    // console.log($event)
    this.searchService.search($event as any as string).subscribe(results => {
      // console.log('Service search got results', results)
      this.filteredNodes = results.slice(0, 50)
    })
  }

  navigateTo(node: any) {
    this.navigationService.navigateToNodeLastChild(node)
  }
}
