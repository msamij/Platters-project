import { DOMStrings } from "./views/base";
import { getSearchRecipes } from "../js/models/Search";
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
  let appLoadRecipes = [];

  // *- As on the appload we need to render 4 different types of recipes so ⬇⬇.
  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in results[].
  for (const rec of recipeQueries) {
    appLoadRecipes.push(await getSearchRecipes(rec));
  }
  // *- Save recipes in state.
  state.appLoadRecipes = appLoadRecipes;
  // *- Now in the recipe[] we have 4 different types of recipes[] that can be rendered on the UI.
  // *- If there's an error while fetching recipes render error on UI, else render recipes.
  // appLoadRecipes[0] = [];
  !appLoadRecipes[0].length ||
  !appLoadRecipes[1].length ||
  !appLoadRecipes[2].length ||
  !appLoadRecipes[3].length
    ? renderRecipeloadError()
    : searchView.processRecipes(appLoadRecipes);
  // <==============================================================================================>
  // <==============================================================================================>
  // <==============================================================================================>

  // 3: If user || author is logged in (render account menu) if ! (DO NOT render account menu).
  // 4: Render liked recipes of user || author (if any).
  // 4: Render most liked recipes (if any).
};

const renderRecipeloadError = () => {
  const recipeLoadErrorMarkup = `<h2 class="error"> Error loading Recipes Please try again 😕</h2>`;
  DOMStrings.errorMessage.insertAdjacentHTML(
    "afterbegin",
    recipeLoadErrorMarkup
  );
  DOMStrings.errorMessage.classList.add("animation");
  searchView.removePrevRecipesMarkup();
};

const controlPagination = (event) => {
  let recipeBoxNo, page;
  // *- As in the markup we have 4 different boxex for different types of recipe boxes.
  // *- So we need to dettermine on which recipe box (1, 2, 3, 4 ?) (pagination btn) event has triggered.
  // *- And based on that recipe box no it will paginate recipes.
  // *- Let's assume that it's on recipe-box-1 so on that box we will paginate recipes.

  // *- First it will check if the event is fired on pagination btn or not only then process.
  if (event.target.closest(".btn-pagination")) {
    // *- Get the data-attribute for page value.
    page = parseInt(event.target.closest(".btn-pagination").dataset.goto);
    // *- Get recipe-box-no from DOM.
    // *- Move up to the recipe box in the DOM and get the className of that recipe box.
    // *- Now classNames in an array is ['recipes-box', 'recipes-box-1'] since we split it by "".
    // *- And then we get the [1] element which is ['recipes-box-1'] also split it by "-".
    // *- And no we have an array of ['recipe', 'box', '1'].
    // *- And finally we retreive the recipe box no which is in this case is the 2 element in an array [2] = ['1'].
    recipeBoxNo = event.target
      .closest(".btn-pagination")
      .parentElement.parentElement.className.split(" ")[1]
      .split("-")[2];
    searchView.processRecipes(state.appLoadRecipes, recipeBoxNo, page);
  }
};

// ==============================================================
// || Whenever browser window is loaded execute controlAppLoad ||
// ==============================================================
window.addEventListener("load", controlAppLoad);

// ===========================================
// || Event listener for pagination buttons ||
// ===========================================
DOMStrings.recipesContainer.addEventListener("click", (event) => {
  controlPagination(event);
});
