import { Component, OnInit } from '@angular/core';
import {RecipesService} from "../recipes/recipes.service";
import {Recipe} from "../recipes/Recipe";

@Component({
  selector: 'app-recipes-page',
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.sass'],
})
export class RecipesPageComponent implements OnInit {

  createItemFunc = () => {
    const recipe = new Recipe(this.recipesService);
    recipe.title = `[ new Recipe ${new Date()} ]`
    return recipe
  }

  constructor(
    public recipesService: RecipesService,
  ) {

  }

  ngOnInit() {}

}
