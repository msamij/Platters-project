import { DOMStrings } from "./views/base";
import { getSearchRecipes } from "../js/models/Search";
import Recipe from "./models/Recipes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";

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
  // *- Remove apploadHTML
  appLoadHTML(`hidden`, `0`);
  // *- Render skeleton Loader.
  searchView.renderSkeletonRecipes();
  // <==========================================================================================>
  // <==========================================================================================>
  // <==========================================================================================>

  // *- Using an array of different types of recipe queries to fetch from API.
  const recipeQueries = [`pizzas`, `deserts`, `diet foods`, `fast foods`];
  let recipes = [];

  // 1: Get recipes from Recipes.js.
  // *- As on the appload we need to render 4 different types of recipes so ⬇⬇.
  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in results[].
  for (const rec of recipeQueries) {
    recipes.push(await getSearchRecipes(rec));
  }
  // *- Save recipes in state.
  state.recipes = recipes;
  // *- Render apploadHTML
  appLoadHTML(`visible`, `1`);

  // *- A flag for rendering query recipes.
  // *- appLoadRecipes have an array [] in which we also have 4 different types of recipes array [[rec1], [rec2], [rec3], [rec4],].
  // *- So when we are doing pagination, the paginateRecipe method will try to access recipes at certain index.
  // *- Let's say it's accessing [[0], [1], [2], [3]] recipe array [0] where each index is also an array of recipes.
  // *- Eg [[0] at 0 we have an array desert recipes and at [1] we have an array of fast foods recipes].
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

  // 2: If user || author is logged in (render account menu) if ! (DO NOT render account menu).
  // 3: Render liked recipes of user || author (if any).
  // 4: Render most liked recipes (if any).
};
const appLoadHTML = (visibility, opacity) => {
  [
    DOMStrings.createRecipeBox,
    DOMStrings.categoriesBox,
    DOMStrings.searchForm,
  ].forEach((item) => {
    item.style.visibility = visibility;
    item.style.opacity = opacity;
  });
};

// *- Render errorMessage if for some reason recipes were not fetched.
const renderRecipeError = (errorMessage) => {
  const recipeLoadErrorMarkup = `<h2 class="error"> ${errorMessage}</h2>`;
  DOMStrings.errorMessage.insertAdjacentHTML(
    "afterbegin",
    recipeLoadErrorMarkup
  );
  DOMStrings.errorMessage.classList.add(`animation`);
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
  if (event.target.closest(`.btn-pagination`)) {
    // *- Get the data-attribute for page value.
    page = parseInt(event.target.closest(`.btn-pagination`).dataset.goto);
    // *- Get recipe-box-no from DOM.
    // *- Move up to the recipe box in the DOM and get the className of that recipe box.
    // *- Now classNames in an array is ['recipes-box', 'recipes-box-1'] since we split it by "".
    // *- And then we get the [1] element which is ['recipes-box-1'] also split it by "-".
    // *- And no we have an array of ['recipe', 'box', '1'].
    // *- And finally we retreive the recipe box no which is in this case is the 2 element in an array [2] = ['1'].
    recipeBoxNo = event.target
      .closest(`.btn-pagination`)
      .parentElement.parentElement.className.split(" ")[1]
      .split("-")[2];

    state.isQueryRecipes
      ? searchView.processRecipes(state.recipes, true, `1`, page)
      : searchView.processRecipes(state.recipes, false, recipeBoxNo, page);
  }
};

// ******/ CONTROL QUERY  \******
// *- Checks if query is from Search form or from categories buttons
const controlQuery = (btnQuery) => {
  // *- If query is from search form
  if (DOMStrings.searchInput.value) {
    // *- Get search query from search input form.
    let query = DOMStrings.searchInput.value;
    // *- Clear search input.
    searchView.clearSearchInput();

    // *- Get query recipe.
    controlQueryRecipes(query);
  }
  // *- If query is from categories buttons.
  else if (btnQuery) controlQueryRecipes(btnQuery);
};

// ******/ CONTROL QUERY RECIPES \******
// *- Render recipes fetched from the API (Using recipe name) (Through search form).
// *- Render recipes of author fetched from author |MODEL| (Using recipe name) (Through search form).
const controlQueryRecipes = async (query) => {
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

  if (state.recipes.length > 0) searchView.processRecipes(state.recipes, true);
  else {
    renderRecipeError(`Couldn't find the recipe you are looking for 🧐❌`);
    controlAppLoad();
  }
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
};

// ******/ CONTROL RECIPES \******
// *- Render recipe details based on the recipe ID (Either from API or from author recipes |MODEL|).
const controlRecipes = async () => {
  // *- Get recipe ID from URL.
  const ID = parseInt(window.location.hash.split("#").join(""));
  // *- Validate ID.
  if (ID) {
    // *- If there's already a recipe remove it from DOM.
    if (recipeView.prevRecipeDetails())
      recipeView.removeRecipeDetailsMarkup(true);
    // *- Remove appLoadHTML.
    appLoadHTML(`hidden`, `0`);
    // *- Render skelteton.
    recipeView.renderSkeletonRecipeDetails();
    const recipe = new Recipe(ID);
    await recipe.getRecipes();
    // *- Save in state.
    state.recipeDetails = recipe;
    // *- Remove skelteton.
    recipeView.removeRecipeDetailsMarkup();
    // *- Render recipe
    recipeView.processRecipeDetails(recipe);
    // *- Render the recipe which was clicked.
    // *- Check if recipe ID is from API recipes or from author |MODEL|.
    // *- If recipe ID is author |MODEL|.
    // if (isAuthorRecipe) {
    // *- Get recipe details from author |MODEL| using ID.
    // }
    // *- Else it's an API recipe get recipe details from API using ID.
  }
};

// ============================================================================
// || Event listeners for whenever browser window is loaded and for hashchange ||
// ============================================================================
[`load`, `hashchange`].forEach((event) => {
  window.addEventListener(event, () => {
    event === `load` ? controlAppLoad() : controlRecipes();
  });
});

// ===========================================
// || Event listener for pagination buttons ||
// ===========================================
DOMStrings.recipesContainer.addEventListener(`click`, (event) => {
  controlPagination(event);
});

// ====================================
// || Event listener for Search form ||
// ====================================
DOMStrings.searchForm.addEventListener(`submit`, (event) => {
  event.preventDefault();
  controlQuery();
});

// ===============================================================================================
// || Event listeners for [`like button`, `close recipe button`, `ingredient pagination buttons`,
// || `How To cook button`, `Close instruction button`]
// ===============================================================================================
DOMStrings.recipesSection.addEventListener(`click`, (event) => {
  let page;
  // *- Event listener to paginate ingredients.
  if (event.target.closest(`.btn-ingredient`)) {
    page = parseInt(event.target.closest(`.btn-ingredient`).dataset.goto);
    recipeView.paginateRecipeIngredient(state.recipeDetails.ingredients, page);
  }
  // *- Event listener to render recipeInstructions.
  else if (event.target.closest(`.recipe-instructions-btn`)) {
    const instructions = document.querySelector(`.instructions`);
    instructions.style.visibility = `visible`;
    instructions.style.opacity = `1`;
  }
  // *- Event listener to close recipeInstructions.
  else if (event.target.closest(`.btn-close-ingredient`)) {
    const instructions = document.querySelector(`.instructions`);
    instructions.style.visibility = `hidden`;
    instructions.style.opacity = `0`;
  }
  // *- Event listener to remove recipeDetails.
  else if (event.target.closest(`.btn-close-recipe`)) {
    // *- Remove recipeDetails.
    recipeView.removeRecipeDetailsMarkup(true);
    // *- Render searchForm and categories buttons.
    appLoadHTML(`visible`, `1`);
  }
});

// ===========================================
// || Event listener for categories buttons ||
// ===========================================
DOMStrings.categoriesBox.addEventListener(`click`, (event) => {
  if (event.target.closest(`.btn-categories`)) {
    const btnText = event.target.closest(`.btn-categories`).textContent;
    if (btnText.includes(`All`)) {
      // *- Remove Appload Recipes So it Won't duplicate
      searchView.removePrevRecipesMarkup();
      controlAppLoad();
    } else controlQuery(btnText);
  }
});
