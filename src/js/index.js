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
// 3: Implement recipes pagination (DONE).
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
  // 1: Render skeleton Loader.
  searchView.renderSkeletonRecipes();
  // <==========================================================================================>
  // <==========================================================================================>
  // <==========================================================================================>

  // *- Using an array of different types of recipe queries to fetch from API.
  const recipeQueries = [`pizzas`, `deserts`, `diet foods`, `fast foods`];
  let recipes = [];

  // 2: Get recipes from Recipes.js.
  // *- As on the appload we need to render 4 different types of recipes so ⬇⬇.
  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in results[].
  for (const rec of recipeQueries) {
    recipes.push(await getSearchRecipes(rec));
  }
  // *- Save recipes in state.
  state.recipes = recipes;

  // *- A flag for rendering query recipes.
  // *- appLoadRecipes have an array [] in which we also have 4 different types of recipes array [[rec1], [rec2], [rec3], [rec4],].
  // *- So when we are doing pagination, the paginateRecipe method will try to access recipes at certain index.
  // *- Let's say it's accessing [[0],[1], [2], [3]] recipe array [0].
  // *- But in the case of query recipe we only have one array of recipes ([rec1] like this).
  // *- It wil throw an error when we try to access a recipe that doesn't exist'.
  // *- So if we did a query search we set the isQueryRecipes to true.
  // *- So that it only access the array of recipe. (like this [recipe]) (Not Like this [[rec1], [rec2], [rec3]]).
  // *- Look at the paginateRecipe method.

  state.isQueryRecipes = false;
  // *- Now in the recipe[] we have 4 different types of recipes[] that can be rendered on the UI.
  // *- If there's an error while fetching recipes render error on UI, else render recipes.
  // recipes[0] = [];
  !recipes[0].length ||
  !recipes[1].length ||
  !recipes[2].length ||
  !recipes[3].length
    ? renderRecipeError(`Error loading Recipes Please try again 😕`)
    : searchView.processRecipes(recipes);
  // <==============================================================================================>
  // <==============================================================================================>
  // <==============================================================================================>

  // 3: If user || author is logged in (render account menu) if ! (DO NOT render account menu).
  // 4: Render liked recipes of user || author (if any).
  // 4: Render most liked recipes (if any).
};

// *- Render errorMessage if for some reason recipes were not fetched.
const renderRecipeError = (errorMessage) => {
  const recipeLoadErrorMarkup = `<h2 class="error"> ${errorMessage}</h2>`;
  DOMStrings.errorMessage.insertAdjacentHTML(
    "afterbegin",
    recipeLoadErrorMarkup
  );
  DOMStrings.errorMessage.classList.add("animation");
  searchView.removePrevRecipesMarkup();
};

// ******/ CONTROL PAGINATION \******
const controlPagination = (event) => {
  let recipeBoxNo, page;
  // *- As in the markup we have 4 different boxex for different types of recipe boxes.
  // *- So we need to dettermine on which recipe box (1, 2, 3, 4 ?) (pagination btn) event has triggered.
  // *- And based on that recipe box no it will do pagination of recipes.
  // *- Let's assume that it's on recipe-box-1 so on that box we will do pagination of recipes.

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

    state.isQueryRecipes
      ? searchView.processRecipes(state.recipes, true, "1", page)
      : searchView.processRecipes(state.recipes, false, recipeBoxNo, page);
  }
};

// ******/ CONTROL RECIPES \******
// *- Render recipes fetched from the API (Using recipe name) (Through search form).
// *- Render recipes of author fetched from author |MODEL| (Using recipe name) (Through search form).
// *- Render recipe details based on the recipe ID (Either from API or from author recipes |MODEL|).
const controlRecipes = async (event) => {
  // *- Check if it's a recipe query from search form.
  if (DOMStrings.searchInput.value) {
    // *- Get search query from search input.
    let query = DOMStrings.searchInput.value;
    // *- Clear search input.
    searchView.clearSearchInput();

    // *- Fetch recipe from API and from author recipe |MODEL|.
    // *- For instance recipe query is "pizza" it will try to find in author recipe |MODEL| and also fetch from API.
    // *- If it finds from both render from both, From API and from author |MODEL|.
    // *- If cannot find recipe from API, find in author |MODEL| and then render it.
    // *- If cannot find from both API and from author |MODEL|, then render error.

    // *- Remove previous recipes.
    searchView.removePrevRecipesMarkup();
    // *- Render skeleton loaders.
    searchView.renderSkeletonRecipes();
    // *- Fetch recipes from API.
    let queryRecipes = ([] = await getSearchRecipes(query));
    // *- Save apiRecipes in state.
    state.recipes = queryRecipes;
    // *- Set the flag to true.
    state.isQueryRecipes = true;

    // <=============TO BE IMPLEMENTED=============>
    // *- Get recipes from author |MODEL|
    // let authorRecipes;
    // *- Save authorRecipes in state.
    // state.authorRecipes = authorRecipes;

    // // *- If recipe is found in both MODEL and from API.
    // if (state.apiRecipes && state.authorRecipes)
    //   searchView.processRecipes(state.authorRecipes);
    // // *- If recipe is found only from API.
    // else if (state.apiRecipes) searchView.processRecipes(state.apiRecipes, "1");
    // // *- If recipe is found only in MODEL.
    // else if (state.authorRecipes)
    //   searchView.processRecipes(state.authorRecipes, "1");
    // // *- Render error if recipe was not found.
    // else renderRecipeError("Couldn't find the recipe you are looking for 🧐❌");
    // <=============================================================================>

    if (state.recipes.length > 0)
      searchView.processRecipes(state.recipes, true);
    else {
      renderRecipeError("Couldn't find the recipe you are looking for 🧐❌");
      controlAppLoad();
    }
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

// ====================================
// || Event listener for Search form ||
// ====================================
DOMStrings.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlRecipes(event);
});
