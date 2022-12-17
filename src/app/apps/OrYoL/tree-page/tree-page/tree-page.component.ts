import { Component, OnInit } from '@angular/core';
import {CommandsService} from '../../core/commands.service'

@Component({
  selector: 'app-tree-page',
  templateUrl: './tree-page.component.html',
  styleUrls: ['./tree-page.component.scss']
})
export class TreePageComponent implements OnInit {

  // TODO: route handling should be here, not in TreeHostComponent

  constructor(
    public commandsService: CommandsService,
  ) { }

  ngOnInit() {
  }

}
