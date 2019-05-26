import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from "../Recipe";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.sass'],
})
export class RecipeItemComponent implements OnInit {

  @Input() item: Recipe

  constructor() { }

  ngOnInit() {}

}
