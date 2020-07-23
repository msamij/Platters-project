import { ID } from "../views/base";

export default class AuthorRecipes {
  constructor(recipeName, imgURL, instructions, authorID) {
    this.recipeName = recipeName;
    this.imgURL = imgURL;
    this.instructions = instructions;
    this.ingredients = [];
    this.authorID = authorID;
    this.recipeID = ID();
  }

  //   saveRecipe(recipe) {}
  //   updateRecipe(recipe) {}
  //   deleteRecipe() {}
  //   addIngredient(ingObj) {}

  static findRecipe(ID) {
    let isRecipe = false;
    data.recipes.forEach((recipe) => {
      if (recipe.recipeID === ID) isRecipe = true;
    });
    return isRecipe;
  }
}

const data = {
  recipes: [],
};
