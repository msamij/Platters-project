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
// 1: Render all recipes on load.
// 2: Implement recipe Search.
// 3: Implement recipe details (ID).
// 4: Implement error handling.

// ******/ CONTROL APPLOAD \******
// *- Controls rendering recipes on appload.
// *- Controls rendering likes on appload.
// *- Controls rendering most liked recipes on appload.
// *- Controls rendering Users/Author account on appload.
const controlAppLoad = async () => {
  // 1: Execute init function.

  // 2: Get recipes from Recipes.js.
  // *- Using an array of different types of recipe queries to fetch from API.
  const recipeQueries = [`pizzas`, `deserts`, `fast foods`, `diet foods`];
  let recipes = [];

  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in results[].
  // for (const rec of recipeQueries) {
  //   recipes.push(await Search.getSearchRecipes(rec));
  // }

  // *- If there's an error while fetching recipes render it on UI, else render recipes.
  !recipes.length
    ? renderRecipeloadError()
    : searchView.processRecipes(recipes);

  // let newRecipes = [...recipes[0]];
  // 3: If user || author is logged in (render account menu) if ! (DO NOT rend account menu).
  // 4: Render likes (if any).
  // 4: Render most liked recipes (if any).
};

const renderRecipeloadError = () => {
  const errorMarkup = `<h2 class="error">Error loading recipes please try again 😕</h2>`;
  DOMStrings.errorMessage.insertAdjacentHTML("afterbegin", errorMarkup);
  DOMStrings.errorMessage.classList.add("animation");
};

// ==============================================================
// || Whenever browser window is loaded execute controlAppLoad ||
// ==============================================================
window.addEventListener("load", controlAppLoad);
