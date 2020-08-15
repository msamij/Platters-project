import { DOMElements, DOMClasses, parseRecipeTitle } from "./base";
import * as baseMarkup from "./baseMarkup";

export const toggleLikeBtn = (isLike) => {
  // *- Get the icon which is inside of the like button.
  const icon = document.querySelector(DOMClasses.likeButton).childNodes;

  Array.from(icon).forEach((icon) => icon.parentElement.removeChild(icon));

  document
    .querySelector(DOMClasses.likeButton)
    .insertAdjacentHTML(
      "afterbegin",
      `<i class="${isLike ? "fas" : "far"} fa-heart"></i>`
    );
};

export const renderLikedRecipes = (recipe) => {
  // *- If Liked recipes icon is already in the DOM then just render newly liked recipe.
  if (DOMElements.likesBox.childNodes.length > 0) {
    document.querySelector(DOMClasses.likedItems).insertAdjacentHTML(
      "beforeend",
      recipe.map((recipe) =>
        baseMarkup.renderLikedRecipe(recipe, parseRecipeTitle(recipe.title))
      )
    );
  } else {
    if (recipe.length > 0) {
      // *- Render base markup for liked recipes (Heart icon).
      DOMElements.likesBox.insertAdjacentHTML(
        "afterbegin",
        baseMarkup.renderLikedRecipesMenu()
      );
      // *- Render liked recipes.
      recipe.forEach((recipe) => {
        document
          .querySelector(DOMClasses.likedItems)
          .insertAdjacentHTML(
            "beforeend",
            baseMarkup.renderLikedRecipe(recipe, parseRecipeTitle(recipe.title))
          );
      });
    }
  }
};

export const renderMostLikedRecipes = (recipes) => {
  // *- If we have more than 4 recipes, then only render first four recipes.
  if (recipes.length <= 4) {
    console.log(recipes);

    recipes.forEach((likeObj) => {
      DOMElements.mostLikedRecipesContainer.insertAdjacentHTML(
        `beforeend`,
        baseMarkup.renderMostLikedRecipe(
          likeObj.recipe,
          parseRecipeTitle(likeObj.recipe.title),
          likeObj.likes
        )
      );
    });
  } else {
    console.log(recipes.slice(0, 4));
    recipes.slice(0, 4).forEach((likeObj) => {
      DOMElements.mostLikedRecipesContainer.insertAdjacentHTML(
        `beforeend`,
        baseMarkup.renderMostLikedRecipe(
          likeObj.recipe,
          parseRecipeTitle(likeObj.recipe.title),
          likeObj.likes
        )
      );
    });
  }
};

export const removeMostLikedRecipe = () => {
  // *- Remove previous recipes because each time we like or unlike a recipe,
  // *- The sort function will sort the recipes and so we need to render recipes again,
  // *- According to the new sorted recipes array.
  const prevRecipes = DOMElements.mostLikedRecipesContainer.childNodes;
  Array.from(prevRecipes).forEach((item) => {
    item.parentElement.removeChild(item);
  });
};

export const removeLikedRecipe = (likedRecipes, ID) => {
  // *- If we have no liked recipes then simply remove the liked Recipes (HEART) icon.
  if (likedRecipes.length === 0) {
    const likedItems = DOMElements.likesBox.childNodes;
    Array.from(likedItems).forEach((item) =>
      item.parentElement.removeChild(item)
    );
  } else {
    // *- Selecting the recipe based on the ID.
    const recipeToUnlike = document.querySelector(`a[href="#${ID}"]`);
    // *- Remove liked recipe from UI.
    recipeToUnlike.parentElement.removeChild(recipeToUnlike);
  }
};
