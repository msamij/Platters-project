import { DOMStrings, parseRecipeTitle } from "./base";
import * as markupView from "./markupView";

export const toggleLikeBtn = (isLike) => {
  // *- Get the icon which is inside of the like button.
  const icon = document.querySelector(`.like-btn`).childNodes;

  Array.from(icon).forEach((icon) => icon.parentElement.removeChild(icon));

  document
    .querySelector(`.like-btn`)
    .insertAdjacentHTML(
      "afterbegin",
      `<i class="${isLike ? "fas" : "far"} fa-heart"></i>`
    );
};

export const renderLikedRecipes = (recipe) => {
  // *- Parse recipe title.
  recipe.forEach((recipe) => (recipe.title = parseRecipeTitle(recipe.title)));
  // *- If Liked recipes icon is already in the DOM then just render newly liked recipe.
  if (DOMStrings.likesBox.childNodes.length > 0) {
    document.querySelector(`.liked-items`).insertAdjacentHTML(
      "beforeend",
      recipe.map((recipe) => markupView.renderLikedRecipe(recipe))
    );
  } else {
    // *- First render liked Heart icon.
    DOMStrings.likesBox.insertAdjacentHTML(
      "afterbegin",
      markupView.renderLikedRecipesMenu()
    );
    // *- Render liked recipes.
    recipe.forEach((recipe) => {
      document
        .querySelector(`.liked-items`)
        .insertAdjacentHTML("beforeend", markupView.renderLikedRecipe(recipe));
    });
  }
};

export const removeLikedRecipe = (isLikeIcon, ID) => {
  // *- If we have no liked recipes then simply remove the liked Recipes icon.
  if (!isLikeIcon) {
    const likedItems = DOMStrings.likesBox.childNodes;
    Array.from(likedItems).forEach((item) =>
      item.parentElement.removeChild(item)
    );
  } else {
    // *- Selecting the recipe based on the ID.
    const recipeToUnlike = document.querySelector(`a[href="#${ID}"]`);
    recipeToUnlike.parentElement.removeChild(recipeToUnlike);
  }
};
