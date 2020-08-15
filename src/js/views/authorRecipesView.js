import {
  DOMInputs,
  DOMElements,
  renderPaginationBtns,
  parseRecipeTitle,
} from "./base";
import * as baseMarkup from "./baseMarkup";

export const recipeName = () => DOMInputs.inputRecipeName.value;
export const imgURL = () => DOMInputs.inputImgUrl.value;
export const recipeInstructions = () => DOMInputs.inputInstructions.value;
export const ingredient = () => DOMInputs.inputIngredient.value;

export const clearFields = () => {
  [
    DOMInputs.inputRecipeName,
    DOMInputs.inputImgUrl,
    DOMInputs.inputInstructions,
    DOMInputs.inputIngredient,
  ].forEach((input) => (input.value = ``));
};

export const renderAuthorRecipes = (recipes) => {
  // *- If we only have one recipe object.
  if (recipes.length === 1)
    DOMElements.recipesContainer.insertAdjacentHTML(
      "afterbegin",
      baseMarkup.renderAuthorRecipe(
        recipes[0],
        parseRecipeTitle(recipes[0].title)
      )
    );
  else {
    DOMElements.recipesContainer.insertAdjacentHTML(
      "afterbegin",
      baseMarkup.renderAuthorRecipes(
        recipes,
        parseRecipeTitle(recipes[0].title),
        parseRecipeTitle(recipes[1].title)
      )
    );
    renderPaginationBtns(1, `1`, recipes.length, 2);
  }
};

export const renderAuthorRecipeDetails = () =>
  DOMElements.recipesSection.insertAdjacentHTML(
    "beforeend",
    baseMarkup.renderRecipeDetailsMarkup()
  );

export const removeAuthorRecipe = (ID) => {
  // *- Selecting the recipe based on the ID.
  const recipeToRemove = document.querySelector(`a[href="#${ID}"]`);
  console.log(recipeToRemove);
  recipeToRemove.parentElement.removeChild(recipeToRemove);
};
