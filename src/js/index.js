import { DOMStrings } from "./views/base";
import { getSearchRecipes } from "./models/Search";
import Recipe from "./models/Recipes";
import Users from "./models/Users";
import AuthorRecipes from "./models/AuthorRecipes";
import * as LikedRecipes from "./models/LikedRecipes";
import * as Account from "./models/Account";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as accountView from "./views/accountView";
import * as likesView from "./views/likesView";
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
// 4: Implement recipe details (ID) (DONE).
// 5: Implement error handling (DONE).
// 7: Implement user & author sign in model (DONE).
// 6: Implement recipe liking model (DONE).
// 8: Implement recipe builder model.
// 9: Implement recipe edit feature.
// 10: Implement recipe delete feature.
// 11: Implement view author recipes feature.

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
    ? renderMessage(true, `Error loading Recipes Please try again 😕`, true)
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

const renderMessage = (isError, message, isRemovePrevRecipe) => {
  if (isError) {
    DOMStrings.error.textContent = message;
    DOMStrings.errorMessage.style.display = `block`;
    // *- After 2s message will fadeout.
    setTimeout(() => (DOMStrings.errorMessage.style.display = `none`), 3000);
    if (isRemovePrevRecipe) searchView.removePrevRecipesMarkup();
  } else {
    DOMStrings.success.textContent = message;
    DOMStrings.successMessage.style.display = `block`;
    // *- After 2s message will fadeout.
    setTimeout(() => (DOMStrings.successMessage.style.display = `none`), 3000);
  }
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
      .parentElement.parentElement.className.split(` `)[1]
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
    renderMessage(
      true,
      `Couldn't find the recipe you are looking for 🧐❌`,
      true
    );
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
  // else renderMessage(true,"Couldn't find the recipe you are looking for 🧐❌",true);
  // <=============================================================================>
};

// ******/ CONTROL RECIPES \******
// *- Render recipe details based on the recipe ID (Either from API or from author recipes |MODEL|).
const controlRecipes = async () => {
  // *- Get recipe ID from URL.
  const ID = parseInt(window.location.hash.split(`#`).join(``));
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
    // *- Fetch recipe.
    await recipe.getRecipes();
    // *- Save in state.
    state.recipeDetails = recipe;
    // *- Remove skelteton.
    recipeView.removeRecipeDetailsMarkup();
    // *- Render recipe
    recipeView.processRecipeDetails(recipe);
    // *- Toggle liked icon on UI if recipe is Liked.
    if (state.user) isIDRecipeLiked(state.recipeDetails.id, true, state.user);
    else if (state.author)
      isIDRecipeLiked(state.recipeDetails.id, false, state.author);
    // *- Render recipe
    // *- Render the recipe which was clicked.
    // *- Check if recipe ID is from API recipes or from author |MODEL|.
    // *- If recipe ID is author |MODEL|.
    // if (isAuthorRecipe) {
    // *- Get recipe details from author |MODEL| using ID.
    // }
    // *- Else it's an API recipe get recipe details from API using ID.
  }
};

// ******/ CONTROL VALIDATION OF LIKING RECIPE \******
// *- Like recipe only when user or author is logged in.
// *- Otherwise render Login/Signup form.
const validateRecipeLike = () => {
  if (state.user) controlRecipeLike(true, state.user);
  else if (state.author) controlRecipeLike(false, state.author);
  else {
    DOMStrings.formContainer.style.visibility = `visible`;
    DOMStrings.formContainer.style.opacity = `1`;
    DOMStrings.backdrop.style.display = `block`;
  }
};

// ******/ CONTROL VALIDATION OF ACCOUNT FORM \******
// *- Validate fields.
// *- Check if action is login or signup.
// *- Check if it's user's form or author form to render account menu.
const validateLoginSignup = (btnType, isAuthor) => {
  // *- Read userName & password
  const userName = accountView.userNameValue();
  const password = accountView.passwordValue();

  btnType === `btn-login`
    ? controlLogin(userName, password, isAuthor)
    : controlSignup(userName, password, isAuthor);
};

// ******/ CONTROLS ACCOUNT MENU \******
// *- Checks if user is active or author.
// *- Checks if event target is logout or viewRecipes.
const controlAccountMenu = (event) => {
  if (state.user) {
    // *- If action is to logout.
    if (event.target.closest(`.logout-btn`)) {
      // *- Remove account from state.
      state.user = ``;
      // *- Remove account menu from UI.
      accountView.removeAccountMenu(false);
      // *- Remove any liked Recipes.
      likesView.removeLikedRecipe([]);
      // *- Render create recipe Btn.
      DOMStrings.createRecipeBtn.style.display = `block`;
      // *- Toggle of Like icon from current recipe (only if recipe is being viewed).
      if (recipeView.prevRecipeDetails()) likesView.toggleLikeBtn(false);
    }
  }
};

// ******/ CHECKS ID RECIPE IS LIKED \******
// *- When recipe is clicked check if user or author is logged in or not.
// *- And if logged in check the recipe that's being displayed is liked by user or author.
// *- If liked then render likedIcon.
const isIDRecipeLiked = (recID, isUser, userOrAuthor) => {
  if (!AuthorRecipes.findRecipe(recID)) {
    // *- If recipe is liked then render Like on the UI.
    if (Account.isRecipeLiked(isUser, true, userOrAuthor.userName, recID))
      likesView.toggleLikeBtn(true);
  }
};

// ******/ CONTROL RECIPE LIKE \******
// *- Keep track which recipe was liked and by which user or author.
// *- Check if recipe ID is from API recipes or from author |MODEL|.
// *- If it's from API save in user or author data structure LikedAPIRecipes[].
// *- If it's from Author recipes save in user or author data structure = LikedAuthorRecipes[].
// *- Save in LikedRecipes model with recipe ID and add like to that recipe.
// *- If recipe is already liked unlike recipe remove it from user or author data and remove like from likedRecipes.
const controlRecipeLike = (isUser, userOrAuthor) => {
  // *- Get recipeID from URL.
  const recipe = state.recipeDetails;
  // *- If recipe is NOT from author |MODEL| in other words (if it's an API Recipe).
  if (!AuthorRecipes.findRecipe(recipe.id)) {
    // *- If recipe is not liked yet.
    if (
      !Account.isRecipeLiked(isUser, true, userOrAuthor.userName, recipe.id)
    ) {
      // *- Add like in userOrauthor datastructure.
      Account.likeRecipe(isUser, true, userOrAuthor.userName, recipe);
      // *- Add like in Likes MODEL.
      LikedRecipes.likeRecipe(true, recipe);
      // *- Add LikedRecipe in state.
      state.likedRecipe = state.recipeDetails;
      // *- Toggle likeIcon on the current recipe.
      likesView.toggleLikeBtn(true);
      // *- Render LikedRecipe on the UI.
      likesView.renderLikedRecipes([recipe]);
    }
    // *- Unlike recipe if it's already liked.
    else {
      // *- Unlike from user or author account.
      Account.unlikeRecipe(isUser, true, userOrAuthor.userName, recipe.id);
      // *- Remove like from likes MODEL.
      LikedRecipes.unlikeRecipe(true, recipe.id);
      // *- Remove likeIcon on the current recipe.
      likesView.toggleLikeBtn(false);
      // *- Remove likedRecipe from the UI.
      // likesView.removeLikedRecipe(
      //   userOrAuthor.likedRecipes(true, userOrAuthor.userName),
      //   recipe.id
      // );
      likesView.removeLikedRecipe(
        Account.getLikedRecipes(isUser, userOrAuthor.userName),
        recipe.id
      );
      // *- Remove likedRecipe from state.
      state.likedRecipe = ``;
    }
  }
};

// ******/ CONTROL RENDERING LIKED RECIPES ON LOGIN \******
// *- Render recipes liked by user or author.
// *- Check for each recipe if it's API or author recipe.
const renderLoginLikedRecipes = (isUser, recipes) => {
  // *- Render liked recipes on the UI.
  likesView.renderLikedRecipes(recipes);
  // *- Validate recipe if it's an API or author recipe |MODEL|.
  if (!AuthorRecipes.findRecipe(state.recipeDetails.id)) {
    // *- Validate if it user is active or author.
    if (isUser) {
      // *- Toggle likeIcon on the recipe if recipe that is currently being displayed is already liked.
      if (
        Account.isRecipeLiked(
          true,
          true,
          state.user.userName,
          state.recipeDetails.id
        )
      )
        // *- If liked then toggle like icon on recipe.
        likesView.toggleLikeBtn(true);
    } else if (
      Account.isRecipeLiked(
        false,
        true,
        state.author.userName,
        state.recipeDetails.id
      )
    )
      likesView.toggleLikeBtn(true);
    // if (
    //   state.user.isRecipeLiked(
    //     true,
    //     state.user.userName,
    //     state.recipeDetails.id
    //   )
    // )
    //   likesView.toggleLikeBtn(true);
  }
};

const controlLogin = (userName, password, isAuthor) => {
  // *- Remove First Name and Last Name when logging in.
  controlInputFields(`none`);

  // *- Change h2 text.
  DOMStrings.formText.textContent = `Login to your account`;

  // *- Clear fields.
  accountView.clearFields();

  if (userName && password) {
    // *- Check if it's user account.
    if (!isAuthor) {
      // *- Verify account (As User).
      if (Account.verifyAccount(true, userName, password)) {
        // *- Save user in state.
        state.user = Account.verifyAccount(true, userName, password);
        // *- Render login success message.
        renderMessage(false, `Logged in successfully 😃👍`, false);
        // *- RemoveForm
        removeForm(DOMStrings.formContainer);
        // *- Remove create recipe btn.
        DOMStrings.createRecipeBtn.style.display = `none`;
        // *- Render user account menu.
        accountView.renderAccountMenu(
          isAuthor,
          state.user.firstName,
          state.user.lastName
        );
        // *- Get the liked recipes.
        // const likedRecipes = state.user.getLikedRecipes(state.user.userName);
        const likedRecipes = Account.getLikedRecipes(true, state.user.userName);
        renderLoginLikedRecipes(true, likedRecipes);
        // *- if current recipe that is being viewed is  liked then render liked icon.
      } else renderMessage(true, `Couldn't find the user 🧐❌`, false);
    }
    // else for author
  }
};

const controlSignup = (userName, password, isAuthor) => {
  // *- Render First Name and Last Name when signing up.
  controlInputFields(`block`);

  // *- Change h2 text.
  DOMStrings.formText.textContent = `Signup to Continue`;

  // *- Read first name and last name from DOM.
  const firstName = accountView.firstNameValue(isAuthor);
  const lastName = accountView.lastNameValue(isAuthor);

  // *- Clear fields.
  accountView.clearFields();

  if (firstName && lastName && userName && password) {
    // *- Check if it's user account.
    if (!isAuthor) {
      // *- Verify userName (If userName dosen't exist only then create new account).
      if (!Account.isUserName(true, userName)) {
        // *- Create new user account and save it in state.
        state.user = new Users(firstName, lastName, userName, password);
        // *- Save account in users Datastructure.
        // state.user.saveUser(state.user);
        Account.signup(true, state.user);
        // *- Render signup successful message.
        renderMessage(false, `Signup successful 😃👍`, false);
        // *- RemoveForm
        removeForm(DOMStrings.formContainer);
        // *- Remove create recipe btn.
        DOMStrings.createRecipeBtn.style.display = `none`;
        // *- Render user account menu.
        accountView.renderAccountMenu(
          isAuthor,
          state.user.firstName,
          state.user.lastName
        );
      } else {
        renderMessage(true, `Username already exists 🙁👎`, false);
      }
    }
  }
};

const controlInputFields = (property) => {
  DOMStrings.inputFirstName.style.display = `${property}`;
  DOMStrings.inputLastName.style.display = `${property}`;
};

const removeForm = (formType) => {
  formType.style.opacity = `0`;
  formType.style.visibility = `hidden`;
  DOMStrings.backdrop.style.display = `none`;
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
  } else if (event.target.closest(`.like-btn`)) validateRecipeLike();
});

// ===========================================
// || Event listener for categories buttons ||
// ===========================================
DOMStrings.categoriesBox.addEventListener(`click`, (event) => {
  if (event.target.closest(`.btn-categories`)) {
    // *- Get button text query to fetch recipe.
    const btnText = event.target.closest(`.btn-categories`).textContent;
    if (btnText.includes(`All`)) {
      // *- Remove Appload Recipes So it Won't duplicate
      searchView.removePrevRecipesMarkup();
      controlAppLoad();
    } else controlQuery(btnText);
  }
});

// ===========================================
// || Event listener for Login/Signup form ||
// ===========================================
DOMStrings.accountForm.addEventListener(`click`, (event) => {
  event.preventDefault();
  if (event.target.closest(`.btn-login`) || event.target.closest(`.btn-signup`))
    validateLoginSignup(
      // *- Pass the btn type (signup or login).
      event.target.className.split(` `)[2],
      state.isAuthor
    );
  // *- If event target is close form button.
  else if (event.target.closest(`.btn-close-form`))
    removeForm(DOMStrings.formContainer);
});

// ==============================================
// || Event listener for logging out from account ||
// ==============================================
DOMStrings.boxRight.addEventListener(`click`, (event) =>
  controlAccountMenu(event)
);
