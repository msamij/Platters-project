import { Search } from "../js/models/Search";
import { DOMStrings } from "./views/base";
import * as searchView from "./views/searchView";

// ******/ GLOBAL STATE OBJECT \******
// *- Stores current recipe object.
// *- Stores current author object.
// *- Stores current user object.
// *- Stores current like object.
let state = {};

// TODO:
// 1: Render all recipes on load (DONE).
// 2: Implement recipe Search (using form).
// 3: Implement recipes pagination.
// 4: Implement recipe details (ID).
// 5: Implement error handling.
// 6: Implement recipe liking model.
// 7: Implement user & author sign in model.
// 8: Implement recipe builder model.
// 9: Implement recipe edit feature.
// 10: Implement recipe delete feature.

// ******/ CONTROL APPLOAD \******
// *- Controls rendering recipes on appload.
// *- Controls rendering likes on appload.
// *- Controls rendering most liked recipes on appload.
// *- Controls rendering Users/Author account on appload.
const controlAppLoad = async () => {
  // 1: Execute init function.
  // <==========================================================================================>
  // <==========================================================================================>
  // <==========================================================================================>

  // 2: Get recipes from Recipes.js.
  // *- Using an array of different types of recipe queries to fetch from API.
  const recipeQueries = [`pizzas`, `deserts`, `diet foods`, `fast foods`];
  let recipes = [];

  // *- As on the appload we need to render 4 different types of recipes so ⬇⬇.
  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in results[].
  // for (const rec of recipeQueries) {
  //   recipes.push(await Search.getSearchRecipes(rec));
  // }
  // *- Now in the recipe[] we have 4 different types of recipes[] that can be rendered on the UI.

  // *- If there's an error while fetching recipes render it on UI, else render recipes.
  !recipes.length
    ? renderRecipeloadError()
    : searchView.processRecipes(recipes);
  // <==============================================================================================>
  // <==============================================================================================>
  // <==============================================================================================>

  // 3: If user || author is logged in (render account menu) if ! (DO NOT render account menu).
  // 4: Render liked recipes of user || author (if any).
  // 4: Render most liked recipes (if any).
};

const renderRecipeloadError = () => {
  const recipeLoadErrorMarkup = `<h2 class="error">Error loading recipes please try again 😕</h2>`;
  DOMStrings.errorMessage.insertAdjacentHTML(
    "afterbegin",
    recipeLoadErrorMarkup
  );
  DOMStrings.errorMessage.classList.add("animation");
};

// ==============================================================
// || Whenever browser window is loaded execute controlAppLoad ||
// ==============================================================
window.addEventListener("load", controlAppLoad);
