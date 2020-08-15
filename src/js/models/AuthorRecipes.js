import { ID } from "../views/base";

const data = {
  recipes: [],
};

const readData = () => {
  const storageData = JSON.parse(localStorage.getItem(`authorRecipes`));
  if (storageData !== null) data.recipes = [...storageData.recipes];
};

const saveData = () => {
  localStorage.removeItem(`authorRecipes`);
  localStorage.setItem(`authorRecipes`, JSON.stringify(data));
  console.log(JSON.parse(localStorage.getItem(`authorRecipes`)));
};

export default class AuthorRecipes {
  constructor(title, imgURL, instructions, authorName, authorID) {
    this.title = title;
    this.imgURL = imgURL;
    this.instructions = instructions;
    this.ingredients = [];
    this.authorName = authorName;
    this.authorID = authorID;
    this.recipeID = ID();
  }

  static validateRecipe(title, imgURL) {
    readData();
    let isRecipe = false;
    data.recipes.forEach((recipe) => {
      if (recipe.title === title && recipe.imgURL === imgURL) isRecipe = true;
    });
    return isRecipe;
  }

  static getAuthorRecipes(authorID) {
    readData();
    let recipes = [];
    data.recipes.forEach((recipe) => {
      if (recipe.authorID === authorID) recipes.push(recipe);
    });
    return recipes;
  }

  static getIDRecipe(recipeID) {
    readData();
    let IDRecipe = false;
    data.recipes.forEach((recipe) => {
      if (recipe.recipeID === recipeID) IDRecipe = recipe;
    });
    return IDRecipe;
  }

  static getQueryRecipe(searchTitle) {
    readData();
    let recipe = [];
    data.recipes.forEach((rec) => {
      // *- If we had passed in a search title then loop over all recipes title.
      // *- Split title into an array Eg recipeTitle is --> `Best pizza recipe`,
      // *- So split title into an array like this --> [`Best`, `pizza`, `recipe`]
      // *- Loop over every title and convert currentRecipe Title Eg --> `Best`,
      // *- And searchTitle both into lowercase.
      // *- Because user can also search for a recipe with upperCase letter eg --> Pizza,
      // *- But we could have a recipe that doesn't have an upperCase title eg --> `best pizza recipe`,
      // *- So that would be a problem so we parse it into lowercase.
      // *- Then checks if searchTitle matches the recipe title if matches then return the recipe.
      // *- Otherwise process next recipe.
      // else if (searchTitle) {
      // *- Checks if searchTitle contains any `s` if so then remove letter `s` eg --> `pizzas` ---> `pizza`.
      if (
        searchTitle
          .split(``)
          .slice(searchTitle.length - 1)
          .join(``)
          .includes(`s`)
      ) {
        // *- SearchTitle is eg --> `Pizzas`, But we want to omit the `s` so the final queryString should be `pizza` only.
        // *- So split the query string into an array then splice it from the beginning and end at last element but omit last letter.
        // *- And then join the array back to String.
        searchTitle = searchTitle
          .split(``)
          .splice(0, searchTitle.length - 1)
          .join(``);
      }
      rec.title.split(` `).forEach((title) => {
        title = title.toLowerCase();
        searchTitle = searchTitle.toLowerCase();
        if (title === searchTitle) {
          recipe.push(rec);
        }
      });
    });
    return recipe;
  }

  saveRecipe(recipeObj) {
    data.recipes.push(recipeObj);
    saveData();
  }

  static deleteRecipe(recipeID) {
    readData();
    data.recipes.forEach((recipe) => {
      // *- If recipe was found, then delete recipe.
      if (recipe.recipeID === recipeID)
        data.recipes.splice(
          data.recipes.findIndex((recipe) => recipe.recipeID === recipeID),
          1
        );
    });
    saveData();
  }

  validateIngredient(ingredient, recID) {
    let isIngredient = false;
    data.recipes.forEach((recipe) => {
      if (recipe.recipeID === recID)
        isIngredient = recipe.ingredients.includes(ingredient);
    });
    return isIngredient;
  }

  addIngredient(ingredient, recID) {
    // *- If recipe is found then add ingredient into recipe.
    data.recipes.forEach((recipe) => {
      if (recipe.recipeID === recID) recipe.ingredients.push(ingredient);
    });
    saveData();
  }
}
