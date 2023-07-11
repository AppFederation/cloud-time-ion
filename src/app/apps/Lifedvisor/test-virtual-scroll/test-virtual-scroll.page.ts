import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-virtual-scroll',
  templateUrl: './test-virtual-scroll.page.html',
  styleUrls: ['./test-virtual-scroll.page.scss'],
})
export class TestVirtualScrollPage implements OnInit {

  items: string[] = []

  constructor() {
    for (let i = 0; i < 1000; ++i) {
      this.items.push('item ' + i)
    }
  }

  ngOnInit() {
  }

}
