import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../../core/commands.service'

@Component({
  selector: 'app-commands-overlay',
  templateUrl: './commands-overlay.component.html',
  styleUrls: ['./commands-overlay.component.scss']
})
export class CommandsOverlayComponent implements OnInit {

  constructor(
    public commandsService: CommandsService,
  ) { }

  ngOnInit() {
  }

}
