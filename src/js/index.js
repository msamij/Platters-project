import { DOMElements, DOMButtons, DOMInputs, DOMClasses } from "./views/base";
import { getSearchRecipes } from "./models/Search";
import Recipe from "./models/Recipes";
import Users from "./models/Users";
import Authors from "./models/Authors";
import AuthorRecipes from "./models/AuthorRecipes";
import * as LikedRecipes from "./models/LikedRecipes";
import * as Account from "./models/Account";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as accountView from "./views/accountView";
import * as likesView from "./views/likesView";
import * as authorRecipesView from "./views/authorRecipesView";

// ******/ GLOBAL STATE OBJECT \******
// *- Stores an array of recipes.
// *- Stores current recipe object (Recipe Details object).
// *- Stores current author object.
// *- Stores current user object.
// *- Stores current liked recipe object.
// *- Stores author recipes.
// *- Stores flag to check if recipe is from author |MODEL|.
// *- Stores flag to check if it's a query recipe.
// *- Stores flag to check if recipe ingredients are of type of author recipes.
let state = {};

// ******/ APPLOAD CONTROLLER \******
// *- Controls rendering recipes on appload.
const controlAppLoad = async () => {
  // *- Remove appElements
  appElements(`hidden`, `0`);
  // *- Render skeleton Loader.
  searchView.renderSkeletonRecipes();

  // *- Using an array of different types of recipe queries to fetch from API.
  const recipeQueries = [`pizzas`, `deserts`, `diet foods`, `fast foods`];
  let recipes = [];

  // 1: Get recipes from Recipes MODEL.
  // *- As on the appload we need to render 4 different types of recipes so ⬇⬇.
  // *- Looping through every recipe["query"], get recipe object using current ["query"] and save it in recipes[].
  for (const rec of recipeQueries) {
    recipes.push(await getSearchRecipes(rec));
  }

  // 2: Get recipes from author |MODEL|.
  recipeQueries.forEach((query, index) => {
    if (AuthorRecipes.getQueryRecipe(query).length > 0) {
      recipes[index].push(...AuthorRecipes.getQueryRecipe(query));
    }
  });

  // *- Save recipes in state.
  state.recipes = recipes;

  // *- If any recipe is being displayed then don't render appElements.
  if (!recipeView.prevRecipeDetails())
    // *- Render appElements
    appElements(`visible`, `1`);

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
  !recipes[0].length ||
  !recipes[1].length ||
  !recipes[2].length ||
  !recipes[3].length
    ? renderMessage(true, `Error loading Recipes Please try again 😕`, true)
    : searchView.processRecipes(recipes);
};

// ******/ LOCAL STORAGE CONTROLLER \******
// *- Controls rendering likes on appload.
// *- Controls rendering most liked recipes on appload.
// *- Controls rendering Users/Author account on appload.
const controlLocalStorage = () => {
  // *- If user || author is logged in (render account menu) if ! (DO NOT render account menu).
  if (Account.isLoggedIn()) {
    const account = Account.isLoggedIn();
    // *- Save account in state.
    account.authorID ? (state.author = account) : (state.user = account);

    // *- Remove create recipe btn (If user is logged in) (if author is logged in then render it).
    DOMButtons.createRecipeBtn.style.display = state.user ? `none` : `block`;

    // *- Render account menu (If user is active render user account otherwise render author account).
    accountView.renderAccountMenu(
      state.user ? false : true,
      state.user ? state.user.firstName : state.author.firstName,
      state.user ? state.user.lastName : state.author.lastName
    );

    // *- Get the liked recipes (if user is active get liked recipes of user otherwise of author).
    const likedRecipes = Account.getLikedRecipes(
      state.user ? true : false,
      state.user ? state.user.userName : state.author.userName
    );

    // *- Render liked recipes of user || author (if any).
    likesView.renderLikedRecipes(likedRecipes);
  }
  // *- Render most liked recipes (if any).
  if (LikedRecipes.isMostLikedRecipes().length > 0) {
    // *- Remove previous recipes.
    likesView.removeMostLikedRecipe();
    // *- Get most liked recipes.
    const mostLikedRecipes = [...LikedRecipes.isMostLikedRecipes()];
    // *- Render most liked recipes.
    likesView.renderMostLikedRecipes(mostLikedRecipes);
  }
};

// *- APP ELEMENTS ARE:-
// *- (search form), (categories buttons), (create recipe button).
const appElements = (visibility, opacity) => {
  [
    DOMElements.createRecipeBox,
    DOMElements.categoriesBox,
    DOMElements.searchForm,
  ].forEach((item) => {
    item.style.visibility = visibility;
    item.style.opacity = opacity;
  });
};

const renderMessage = (isError, message, isRemovePrevRecipe) => {
  if (isError) {
    DOMElements.error.textContent = message;
    DOMElements.errorMessage.style.display = `block`;
    // *- After 3.5s message will fadeout.
    setTimeout(() => (DOMElements.errorMessage.style.display = `none`), 3500);
    if (isRemovePrevRecipe) searchView.removePrevRecipesMarkup();
  } else {
    DOMElements.success.textContent = message;
    DOMElements.successMessage.style.display = `block`;
    // *- After 3.5s message will fadeout.
    setTimeout(() => (DOMElements.successMessage.style.display = `none`), 3500);
  }
};

// ******/ PAGINATION CONTROLLER \******
const controlPagination = (event) => {
  let recipeBoxNo, page;
  // *- As in the markup we have 4 different types of recipe boxes.
  // *- So we need to dettermine on which recipe box (1, 2, 3, 4 ?) (pagination btn) event has triggered.
  // *- And based on that recipe box no it will do pagination of recipes.
  // *- Let's assume that it's on recipe-box-1 so on that box we will do pagination of recipes.

  // *- First it will check if the event is fired on pagination btn or not only then process.
  if (event.target.closest(DOMClasses.paginationButton)) {
    // *- Get the data-attribute for page value.
    page = parseInt(
      event.target.closest(DOMClasses.paginationButton).dataset.goto
    );
    // *- Get recipe-box-no from DOM.
    // *- Move up to the recipe box in the DOM and get the className of that recipe box.
    // *- Now classNames in an array like this ['recipes-box', 'recipes-box-1'] so we split it with "".
    // *- And then we get the [1] element which is ['recipes-box-1'] and also split it with "-".
    // *- And no we have an array of ['recipe', 'box', '1'].
    // *- And finally we retreive the recipe box no which is in this case is the 2 element in an array [2] = ['1'].
    recipeBoxNo = event.target
      .closest(DOMClasses.paginationButton)
      .parentElement.parentElement.className.split(` `)[1]
      .split("-")[2];

    // *- If recipe type is searched recipe.
    if (state.isQueryRecipes) {
      searchView.processRecipes(state.recipes, true, false, `1`, page);
    }
    // *- If recipe is from author |MODEL|.
    else if (state.isAuthorRecipes) {
      if (state.authorRecipe.length !== 0)
        searchView.processRecipes(state.authorRecipe, true, true, `1`, page);
    }
    // *- else do pagination on the recipe Box where the event was fired.
    else
      searchView.processRecipes(state.recipes, false, false, recipeBoxNo, page);
  }
};

// ******/ QUERY CONTROLLER \******
// *- Checks if query is from Search form or from categories buttons
const controlQuery = (btnQuery) => {
  // *- If query is from search form
  if (DOMInputs.searchInput.value) {
    // *- Remove appElements
    appElements(`hidden`, `0`);
    // *- Get search query from search input form.
    let query = DOMInputs.searchInput.value;
    // *- Clear search input.
    searchView.clearSearchInput();
    // *- Render query recipe, (Pass the search query).
    controlQueryRecipes(query);
  }
  // *- If query is from categories buttons render the recipes (Based on the selected button text).
  else if (btnQuery) {
    // *- Remove appElements
    appElements(`hidden`, `0`);
    controlQueryRecipes(btnQuery);
  }
};

// ******/ QUERY RECIPES CONTROLLER \******
// *- Render recipes fetched from the API (Using recipe name) (Through search form).
// *- Render recipes of author fetched from author |MODEL| (Using recipe name) (Through search form).
const controlQueryRecipes = async (query) => {
  // *- Remove previous recipes.
  searchView.removePrevRecipesMarkup();
  // *- Render skeleton loaders.
  searchView.renderSkeletonRecipes();
  // *- Fetch recipes from API.
  let queryRecipes = ([] = await getSearchRecipes(query));
  // *- Get recipes from Author |MODEL|.
  if (AuthorRecipes.getQueryRecipe(query).length > 0)
    queryRecipes.push(...AuthorRecipes.getQueryRecipe(query));
  // *- Save apiRecipes in state.
  state.recipes = queryRecipes;
  // *- Set isQueryRecipes flag to true.
  state.isQueryRecipes = true;
  // *- Set isAuthorRecipes flag to false.
  state.isAuthorRecipes = false;

  if (state.recipes.length > 0) {
    searchView.processRecipes(state.recipes, true);
    // *- Render appElements
    appElements(`visible`, `1`);
  } else {
    renderMessage(
      true,
      `Couldn't find the recipe you are looking for 🧐❌`,
      true
    );
    controlAppLoad();
  }
};

// ******/ ID RECIPES CONTROLLER \******
// *- Render recipe details based on the recipe ID (Either from API or from author recipes |MODEL|).
const controlRecipes = async () => {
  // *- Get recipe ID from URL.
  let ID = window.location.hash.split(`#`).join(``);

  // *- If ID can be parsed to a number, then recipe is from API.
  // *- That's because in author recipe we have ID's of something like this 'ksjfkkhk` so a string basically.
  // *- If it can not be parsed to a number, then recipe is from author |MODEL|.
  if (parseInt(ID)) ID = parseInt(ID);

  // *- If ID only then process.
  if (ID) {
    // *- Check if it's an API recipe (If ID can be parsed to an int then it's an API recipe).
    if (parseInt(ID)) {
      // *- If there's already a recipe remove it from DOM then render it so it won't duplicate.
      if (recipeView.prevRecipeDetails())
        recipeView.removeRecipeDetailsMarkup(true);
      // *- Remove appElements.
      appElements(`hidden`, `0`);
      // *- Render skelteton.
      recipeView.renderSkeletonRecipeDetails();
      // *- New recipe object.
      const recipe = new Recipe(ID);
      // *- Fetch recipe.
      await recipe.getRecipes();
      // *- If recipe was fetched successfully.
      if (recipe.title) {
        // *- Save recipe in state.
        state.recipeDetails = recipe;
        // *- Remove skelteton.
        recipeView.removeRecipeDetailsMarkup();
        // *- Render recipe
        recipeView.processRecipeDetails(recipe, false);
        // *- Set isAuthorRecipeIng flag to false because we are not rendering author recipe.
        state.isAuthorRecipeIng = false;

        // *- Toggle liked icon on UI if recipe was Liked.
        if (state.user)
          isIDRecipeLiked(state.recipeDetails.id, true, state.user);
        else if (state.author)
          isIDRecipeLiked(state.recipeDetails.id, false, state.author);
      }
      // *- Render error if something went wrong.
      else {
        // *- Remove markup and render error.
        recipeView.removeRecipeDetailsMarkup(true);
        appElements(`visible`, `1`);
        renderMessage(true, `Error loading recipe 😕`, false);
      }
    }
    // *- Else recipe is from author |MODEL|.
    else {
      // *- If delete recipe button was clicked, DO NOT Render recipe on the UI.
      if (!state.isDeleteRecipe) {
        // *- Checks if recipe exists in datastructure or Not.
        if (AuthorRecipes.getIDRecipe(ID)) {
          //  *- Save recipe in state.
          state.recipeDetails = AuthorRecipes.getIDRecipe(ID);
          // *- If there's already a recipe remove it from DOM then render it so it won't duplicate.
          if (recipeView.prevRecipeDetails())
            recipeView.removeRecipeDetailsMarkup(true);
          // *- Remove appElements.
          appElements(`hidden`, `0`);
          // *- Render base Markup for recipe.
          authorRecipesView.renderAuthorRecipeDetails();
          // *- Render recipe.
          recipeView.processRecipeDetails(state.recipeDetails, true);
          // *- Create a flag for doing pagination on author recipe ingredients.
          // *- Because the recipe that was fetch from API, in it's ingredients array.
          // *- Has different properties then just ingredients.
          // *- So when doing pagination on API recipe the parse ingredient function will try to get those property names,
          // *- Eg --> in ingredients array we have a property named originalString which is the actual ingredient.
          // *- So the pagination function get that property and then render it on the UI.
          // *- It will work for API recipe but the recipes that we created ourselves,
          // *- Don't have this property so eventually it will throw an error when we try to access property that doesn't exist.
          // *- So create a flag when displaying author recipe so that when do pagination on ingredients,
          // *- It will know that is's an author recipe and it will just access the ingredient in an array.
          // *- Not with the originalString property.
          state.isAuthorRecipeIng = true;
          // *- Toggle liked icon on UI if recipe was Liked.
          // *- If liked by user.
          if (state.user)
            isIDRecipeLiked(state.recipeDetails.recipeID, true, state.user);
          // *- If liked by author.
          else if (state.author)
            isIDRecipeLiked(state.recipeDetails.recipeID, false, state.author);
        }
        // *- Render error if author recipe was deleted.
        else renderMessage(true, `Recipe not found ❌`, false);
      }
    }
  }
};

// ******/ CHECKS ID RECIPE IS LIKED \******
// *- When recipe is clicked check if user or author is logged in or not.
// *- And if logged in check the recipe that's being displayed is liked by user or author.
// *- If liked then Toggle likedIcon.
const isIDRecipeLiked = (recID, isUser, userOrAuthor) => {
  // *- If it's an API recipe (If it can be parsed to an integer then it's an API recipe).
  if (parseInt(recID)) {
    // *- If recipe is liked then render Like on the UI.
    if (Account.isRecipeLiked(isUser, true, userOrAuthor.userName, recID))
      likesView.toggleLikeBtn(true);
  }
  // *- If it's an Author model recipe (If it can't be parsed to an integer then it's an Author recipe).
  else if (!parseInt(recID)) {
    // *- If recipe is liked then render Like on the UI.
    if (Account.isRecipeLiked(isUser, false, userOrAuthor.userName, recID))
      likesView.toggleLikeBtn(true);
  }
};

// ============================================================
// <==================VALIDATION METHODS======================>
// ============================================================

// ******/ CONTROL VALIDATION OF ACCOUNT FORM \******
// *- Validate fields.
// *- Check if action is login or signup.
// *- Check if it's user's form or author form to render account menu.
const validateLoginSignup = (btnType, isAuthor) => {
  // *- Read userName & password
  const userName = accountView.userNameValue();
  const password = accountView.passwordValue();

  btnType === `btn-login`
    ? validateLogin(userName, password, isAuthor)
    : validateSignup(userName, password, isAuthor);
};

// ******/ CONTROL VALIDATION OF LIKING RECIPE \******
// *- Like recipe only when user or author is logged in.
// *- Otherwise render Login/Signup form.
const validateRecipeLike = () => {
  if (state.user) validateRecipeType(true, state.user);
  else if (state.author) validateRecipeType(false, state.author);
  else {
    DOMElements.formContainer.style.visibility = `visible`;
    DOMElements.formContainer.style.opacity = `1`;
    DOMElements.backdrop.style.display = `block`;
  }
};

// ******/ CONTROL VALIDATION WHEN CREATING RECIPES \******
// *- Create recipe only when author is logged in.
// *- Otherwise render Login/Signup form.
const validateCreateRecipe = () => {
  if (state.author) {
    // *- When rendering create recipe form don't render ingredient buttons,
    // *- Because at that point we didn't created any recipe so we can't add any ingredients to it.
    DOMButtons.btnSaveIngredient.style.display = `none`;
    DOMButtons.btnNewIngredient.style.display = `none`;
    // *- Render create Recipes form.
    DOMElements.createRecipeContainer.style.visibility = `visible`;
    DOMElements.createRecipeContainer.style.opacity = `1`;
    DOMElements.backdrop.style.display = `block`;
  } else {
    state.isAuthor = true;
    DOMElements.formContainer.style.visibility = `visible`;
    DOMElements.formContainer.style.opacity = `1`;
    DOMElements.backdrop.style.display = `block`;
  }
};

const validateLogin = (userName, password, isAuthor) => {
  // *- Remove First Name and Last Name when logging in.
  controlInputFields(`none`);

  // *- Change h2 text.
  DOMElements.formText.textContent = `Login to your account`;

  // *- Clear fields.
  accountView.clearFields();

  if (userName && password) {
    // *- Login as user.
    !isAuthor
      ? controlLogin(true, userName, password)
      : // *- Login as author.
        controlLogin(false, userName, password);
  }
};

const validateSignup = (userName, password, isAuthor) => {
  // *- Render First Name and Last Name when signing up.
  controlInputFields(`block`);

  // *- Change h2 text.
  DOMElements.formText.textContent = `Signup to Continue`;

  // *- Read first name and last name from DOM.
  const firstName = accountView.firstNameValue();
  const lastName = accountView.lastNameValue();

  // *- Clear fields.
  accountView.clearFields();

  if (firstName && lastName && userName && password) {
    // *- Signup as user.
    !isAuthor
      ? controlSignup(true, firstName, lastName, userName, password)
      : // *- Signup as author.
        controlSignup(false, firstName, lastName, userName, password);
  }
};

const validateLoginLikedRecipes = (isUser, recipes) => {
  // *- Render liked recipes on the UI.
  likesView.renderLikedRecipes(recipes);
  // *- Checks if any recipe is being displayed or not.
  if (recipeView.prevRecipeDetails()) {
    // *- If recipe that's being displayed is an API recipe.
    if (
      parseInt(
        // *- If recipe is from author |MODEL| access recipe ID with (.recipeID)
        state.recipeDetails.recipeID
          ? state.recipeDetails.recipeID
          : // *- If recipe is from API access id with (.id).
            state.recipeDetails.id
      )
    ) {
      // *- Toggle like icon on the recipe only when recipe is being displayed.
      toggleRecipeLike(isUser, true);
    } else toggleRecipeLike(isUser, false);
  }
};

// ============================================================
// <===================CONTROLLER METHODS========================>
// ============================================================

// ******/ VALIDATE RECIPE TYPE \******
// *- Checks if recipe is  from author |MODEL| or from an API.
const validateRecipeType = (isUser, userOrAuthor) => {
  // *- Get recipeID from state.
  // *- If recipe object contains recipeID property, then it is an author recipe.
  const recipeID = state.recipeDetails.recipeID
    ? state.recipeDetails.recipeID
    : state.recipeDetails.id;

  // *- If recipe is NOT from author |MODEL| in other words (if it's an API Recipe).
  if (parseInt(recipeID))
    controlRecipeLike(isUser, userOrAuthor, true, state.recipeDetails);
  // *- Else check if the recipe is in author recipes |MODEL|.
  else if (!parseInt(recipeID))
    controlRecipeLike(isUser, userOrAuthor, false, state.recipeDetails);
};

// ******/ RECIPE LIKE CONTROLLER \******
// *- Keep track which recipe was liked and by which user or author.
// *- Check if recipe ID is from API recipes or from author |MODEL|.
// *- If it's from API save in user or author data structure LikedAPIRecipes[].
// *- If it's from Author recipes save in user or author data structure = LikedAuthorRecipes[].
// *- Save in LikedRecipes model with recipe ID and add like to that recipe.
// *- If recipe is already liked unlike recipe remove it from user or author data and remove like from likedRecipes.
const controlRecipeLike = (isUser, userOrAuthor, isAPIRecipe, recipe) => {
  // *- If recipe is not liked yet.
  if (
    !Account.isRecipeLiked(
      isUser,
      isAPIRecipe,
      userOrAuthor.userName,
      recipe.recipeID ? recipe.recipeID : recipe.id
    )
  ) {
    // *- If user is logged in Add like in user's datastructure.
    // *- Otherwise in author's datastructure.
    Account.likeRecipe(isUser, isAPIRecipe, userOrAuthor.userName, recipe);
    // *- Add like in Likes MODEL.
    LikedRecipes.likeRecipe(isAPIRecipe, recipe);
    // *- Add LikedRecipe in state.
    state.likedRecipe = state.recipeDetails;
    // *- Toggle likeIcon on the current recipe.
    likesView.toggleLikeBtn(true);
    // *- Render LikedRecipe on the UI.
    likesView.renderLikedRecipes([recipe]);
    // *- If we have any most liked recipes then render it.
    if (LikedRecipes.isMostLikedRecipes().length > 0) {
      // *- Remove previous recipes.
      likesView.removeMostLikedRecipe();
      // *- Get most liked recipes.
      const mostLikedRecipes = [...LikedRecipes.isMostLikedRecipes()];
      // *- Render most liked recipes.
      likesView.renderMostLikedRecipes(mostLikedRecipes);
    }
  }
  // *- Unlike recipe if it's already liked.
  else {
    // *- Unlike from user or author account.
    Account.unlikeRecipe(
      isUser,
      isAPIRecipe,
      userOrAuthor.userName,
      recipe.recipeID ? recipe.recipeID : recipe.id
    );
    // *- Remove like from likes MODEL.
    LikedRecipes.unlikeRecipe(
      isAPIRecipe,
      recipe.recipeID ? recipe.recipeID : recipe.id
    );
    // *- Remove likeIcon on the current recipe.
    likesView.toggleLikeBtn(false);
    // *- Remove likedRecipe from the UI.
    likesView.removeLikedRecipe(
      Account.getLikedRecipes(isUser, userOrAuthor.userName),
      recipe.recipeID ? recipe.recipeID : recipe.id
    );
    // *- Update most liked recipes when we unlike a recipe.
    if (LikedRecipes.isMostLikedRecipes().length > 0) {
      // *- Remove previous recipes.
      likesView.removeMostLikedRecipe();
      // *- Get most liked recipes.
      const mostLikedRecipes = [...LikedRecipes.isMostLikedRecipes()];
      // *- Render most liked recipes.
      likesView.renderMostLikedRecipes(mostLikedRecipes);
    }
    // *- If we have no most liked recipes, then simply remove previous recipe.
    else likesView.removeMostLikedRecipe();

    // *- Remove likedRecipe from state.
    state.likedRecipe = false;
  }
};

// ******/ CREATE RECIPES CONTROLLER \******
// *- Validate all inputs only then create recipe.
// *- If event target is save recipe, validate all inputs save recipe in recipes dataStructure.
// *- Save recipe in authors account and in state.
// *- If event target is new ingredient, create new ingredient object and save it in recipes dataStructure.
// *- And also update in state and author recipes.
// *- If event target is new recipe, create new recipe object and save it in recipes dataStructure.
// *- And in author account and in state.
const controlCreateRecipe = (event) => {
  // *- If action is to save recipe, validate all inputs create new recipe object and save it in recipes dataStructure.
  if (event.target.closest(DOMClasses.btnSaveRecipe)) {
    // *- Get inputs from view
    const recipeName = authorRecipesView.recipeName();
    const imgURL = authorRecipesView.imgURL();
    const instructions = authorRecipesView.recipeInstructions();
    const ingredient = authorRecipesView.ingredient();

    // *- Validate all inputs.
    if (recipeName && imgURL && instructions && ingredient) {
      // *- Validate if recipe dosen't exist (Only then create new recipe).
      if (!AuthorRecipes.validateRecipe(recipeName, imgURL)) {
        // *- Create new recipe object and save recipe in state.
        state.authorRecipeObj = new AuthorRecipes(
          recipeName,
          imgURL,
          instructions,
          state.author.userName,
          state.author.authorID
        );
        // *- Save recipe in Author Recipes dataStructure.
        state.authorRecipeObj.saveRecipe(state.authorRecipeObj);
        // *- Save ingredient in Author Recipes dataStructure.
        state.authorRecipeObj.addIngredient(
          ingredient,
          state.authorRecipeObj.recipeID
        );
        // *- Save recipeID in account dataStructure (In author's object recipes array []).
        Account.saveRecipe(
          state.author.authorID,
          state.authorRecipeObj.recipeID
        );
        // *- Render success message.
        renderMessage(false, `Recipe created successfully 🤤😍`, false);
        // *- Render ingredient buttons.
        DOMButtons.btnSaveIngredient.style.display = `block`;
        DOMButtons.btnNewIngredient.style.display = `block`;
      } else renderMessage(true, `Recipe already exists ❌`, false);
    }
  }
  // *- When add new ingredient button is clicked, (clear ingredient field).
  else if (event.target.closest(DOMClasses.btnNewIngredient))
    DOMInputs.inputIngredient.value = ``;
  // *- If action is to create new recipe (clear all fields).
  else if (event.target.closest(DOMClasses.btnNewRecipe)) {
    // *- Always remove ingredient buttons when creating new recipe.
    // *- That's because when we don't have a recipe how can we add ingredients into it.
    // *- And only when recipe is created render ingredient buttons so that we can add more ingredients to the recipe.
    DOMButtons.btnSaveIngredient.style.display = `none`;
    DOMButtons.btnNewIngredient.style.display = `none`;
    authorRecipesView.clearFields();
  }

  // *- If action is to save new ingredient in current recipe.
  else if (event.target.closest(DOMClasses.btnSaveIngredient)) {
    // *- Read ingredient value from view.
    const ingredient = authorRecipesView.ingredient();

    // *- Validate ingredient field.
    if (ingredient) {
      // *- Don't duplicate ingredient.
      if (
        !state.authorRecipeObj.validateIngredient(
          ingredient,
          state.authorRecipeObj.recipeID
        )
      ) {
        // *- Save new ingredient in recipes dataStructure.
        state.authorRecipeObj.addIngredient(
          ingredient,
          state.authorRecipeObj.recipeID
        );
        // *- Render success message.
        renderMessage(false, `Ingredient added 🤤😍`, false);
      } else
        renderMessage(
          true,
          `Ingredient already exists in this recipe ❌`,
          false
        );
    }
  }
};

// ******/ DELETE AUTHOR RECIPE CONTROLLER \******
// *- If action is to delete recipe then remove recipe from UI.
// *- Remove recipe from authorRecipes MODEL.
// *- And also remove recipe ID from author account where recipe ID is stored.
const controlRecipeDelete = (event) => {
  // *- If action is to delete recipe.
  if (event.target.closest(DOMClasses.btnYes)) {
    // *- Get recipeID from URL.
    const ID = window.location.hash.split(`#`).join(``);
    // *- Delete recipe from Author Recipes |MODEL|.
    AuthorRecipes.deleteRecipe(ID);
    // *- Check if recipe is liked by author (If liked then remove it from UI).
    // *- If the recipe that we are deleting is liked by the author of the recipe,
    // *- Then we first need to remove it from the UI, and then delete recipe from Account dataStructure.
    // *- That's because if we delete the recipe from Account dataStructure first,
    // *- Then we will not know that if it was liked by author or not.
    if (Account.isRecipeLiked(false, false, state.author.userName, ID)) {
      console.log("Liked");
      // *- Delete recipe from account.
      Account.deleteRecipe(ID);
      // *- Remove likedRecipe from UI.
      likesView.removeLikedRecipe(
        Account.getLikedRecipes(false, state.author.userName),
        ID
      );
    }

    // *- Update most liked recipes when we delete a recipe.
    if (LikedRecipes.isMostLikedRecipes().length > 0) {
      // *- Remove recipe from LikedRecipes |MODEL|.
      LikedRecipes.deleteRecipe(ID);
      // *- Remove previous recipes.
      likesView.removeMostLikedRecipe();
      // *- Get most liked recipes.
      const mostLikedRecipes = [...LikedRecipes.isMostLikedRecipes()];
      // *- Render most liked recipes.
      likesView.renderMostLikedRecipes(mostLikedRecipes);
    }
    // *- Delete recipe from account.
    Account.deleteRecipe(ID);
    // *- Delete recipe from state.
    state.authorRecipe.forEach((recipe) => {
      // *- If recipe was found then delete it.
      if (recipe.recipeID === ID) {
        state.authorRecipe.splice(
          state.authorRecipe.findIndex((recipe) => recipe.recipeID === ID),
          1
        );
      }
    });
    // *- Remove confirm modal.
    removeModal();
    // *- Remove deleted recipe from UI.
    authorRecipesView.removeAuthorRecipe(ID);
    // *- Update UI when we delete recipe.
    viewAuthorRecipes();
    // *- Remove recipe from LikedRecipes |MODEL|.
    LikedRecipes.deleteRecipe(ID);
  } else if (event.target.closest(DOMClasses.btnNo)) removeModal();
};

const removeModal = () => {
  // *- Remove confirm modal.
  document.querySelector(DOMClasses.deleteRecipeModal).style.display = `none`;
  // *- Remove backdrop.
  DOMElements.backdrop.style.display = `none`;
  // *- Set isDeleteRecipe flag to false.
  state.isDeleteRecipe = false;
};

// ******/ LOGIN CONTROLLER \******
// *- Verify account type as user or author.
// *- Validate username & password.
// *- If username & password are valid, then save account in state.
// *- Render account menu.
// *- Get liked recipes of user or author and render on UI (If any).
const controlLogin = (isUser, userName, password) => {
  // *- Verify account (As User or As Author).
  if (Account.verifyAccount(isUser, userName, password)) {
    // *- Save user in state.
    isUser
      ? (state.user = Account.verifyAccount(true, userName, password))
      : // *- Save author in state.
        (state.author = Account.verifyAccount(false, userName, password));

    // *- Save logged in account in local storage.
    Account.login(isUser ? state.user : state.author);
    // *- Render login success message.
    renderMessage(false, `Logged in successfully 😃👍`, false);
    // *- Remove Form.
    removeForm(DOMElements.formContainer);
    // *- Remove create recipe btn (If user is logged in) (if author is logged in then render it).
    DOMButtons.createRecipeBtn.style.display = isUser ? `none` : `block`;

    // *- Render account menu (If user is active render user account otherwise render author account).
    accountView.renderAccountMenu(
      isUser ? false : true,
      isUser ? state.user.firstName : state.author.firstName,
      isUser ? state.user.lastName : state.author.lastName
    );

    // *- Get the liked recipes (if user is active get liked recipes of user otherwise of author).
    const likedRecipes = Account.getLikedRecipes(
      isUser,
      isUser ? state.user.userName : state.author.userName
    );
    // *- Validate liked recipes (Validate If recipes are from API or from author MODEL)
    // *-  And check if user is logged in or author.
    validateLoginLikedRecipes(isUser, likedRecipes);
  } else renderMessage(true, `Username or password is incorrect ❌`, false);
};

// ******/ SIGNUP CONTROLLER \******
// *- Verify account type as user or author.
// *- Validate username & password.
// *- If username is valid (means that userName is not duplicate), then create new account.
// *- Render account menu.
const controlSignup = (isUser, firstName, lastName, userName, password) => {
  // *- Verify userName (If userName dosen't exist only then create new account).
  if (!Account.isUserName(isUser, userName)) {
    // *- Create new user account and save it in state.
    isUser
      ? (state.user = new Users(firstName, lastName, userName, password))
      : // *- Create new author account and save it in state.
        (state.author = new Authors(firstName, lastName, userName, password));
    // *- If it's user account save account in users Datastructure otherwise in author's dataStructure.
    Account.signup(isUser, isUser ? state.user : state.author);
    // *- Save logged in account in local storage.
    Account.login(isUser ? state.user : state.author);
    // *- Render signup successful message.
    renderMessage(false, `Signup successful 😃👍`, false);
    // *- RemoveForm
    removeForm(DOMElements.formContainer);
    // *- Remove create recipe btn (If user is logged in if author is logged in render it).
    DOMButtons.createRecipeBtn.style.display = isUser ? `none` : `block`;

    // *- Render account menu (If user is active render user account otherwise render author account).
    accountView.renderAccountMenu(
      isUser ? false : true,
      isUser ? state.user.firstName : state.author.firstName,
      isUser ? state.user.lastName : state.author.lastName
    );
  } else {
    renderMessage(true, `Username already exists 🙁👎`, false);
  }
};

// ******/ ACCOUNT MENU CONTROLLER \******
// *- Checks if user is active or author.
// *- Checks if event target is logout or viewRecipes.
const controlAccountMenu = (event) => {
  // *- If action is to logout.
  if (event.target.closest(DOMClasses.logoutButton)) {
    state.user ? logout(true) : logout(false);
  }
  // *- if action is to view author recipes.
  else if (event.target.closest(DOMClasses.btnViewRecipe)) viewAuthorRecipes();
};

const viewAuthorRecipes = () => {
  // *- Get author recipes.
  state.authorRecipe = AuthorRecipes.getAuthorRecipes(state.author.authorID);
  console.log(state.authorRecipe);
  // *- If author created any recipe only then process.
  if (state.authorRecipe.length !== 0) {
    // *- When clicked on view recipes button, set isAuthorRecipes to true,
    // *- That's because we are rendering author recipes on the UI.
    // *- So when we are doing pagination, pagination function will check isAuthorRecipes flag.
    // *- And if it's true it will do pagination on author recipes.
    state.isAuthorRecipes = true;
    // *- Set isQueryRecipes flag to false, because if we had previously rendered search recipes,
    // *- The recipes though searchForm the flag will be set to true.
    // *- But then if we view author recipes and try to do pagination,
    // *- The pagination function will check isQueryRecipes flag and if it's true, it will paginate searched recipes.
    // *- In this case it will not work because we are not rendering searched recipes we are rendering author Recipes.
    // *- So set flag to false, so it won't do pagination on search recipes but on author recipes.
    state.isQueryRecipes = false;
    // *- If any recipe is being displayed, first remove that recipe.
    if (recipeView.prevRecipeDetails()) {
      // *- Remove currently displayed recipe.
      recipeView.removeRecipeDetailsMarkup(true);
      // *- Render appElements.
      appElements(`visible`, `1`);
    }
    // *- Remove all previous recipes.
    searchView.removePrevRecipesMarkup();
    // *- Render author recipes on th UI.
    authorRecipesView.renderAuthorRecipes(state.authorRecipe);
  }
};

const logout = (isUser) => {
  // *- Remove account from state.
  isUser ? (state.user = false) : (state.author = false);
  // *- Remove logged in account from local storage.
  Account.logOut();
  // *- If author is logged in.
  if (!isUser) {
    // *- Remove authorRecipes from state.
    state.authorRecipe = false;
    // *- Set isAuthor flag to false (Which was used to create recipes).
    state.isAuthor = false;
    // *- If author recipes are being displayed on the UI (And author has logged out then remove recipes).
    if (state.isAuthorRecipes) controlAppLoad();
    // *- Set isAuthorRecipes flag to false.
    state.isAuthorRecipes = false;
  }
  // *- Remove account menu from UI.
  accountView.removeAccountMenu(isUser ? false : true);
  // *- Remove any liked Recipes from UI.
  likesView.removeLikedRecipe([]);
  // *- Render create recipe Btn (Only when user has logged out).
  if (isUser) DOMButtons.createRecipeBtn.style.display = `block`;
  // *- Toggle off Like icon from current recipe (only if recipe is being viewed).
  if (recipeView.prevRecipeDetails()) likesView.toggleLikeBtn(false);
};

// ******/ CONTROLS RENDERING LIKED RECIPES ON LOGIN \******
// *- When logged in check if user or author has any liked recipes.
// *- If true then render liked recipes on the UI.
// *- Check if recipe that is currently being displayed is already liked if so then toggle like icon.
const toggleRecipeLike = (isUser, isAPI) => {
  // *- If recipe that's being displayed is liked by the active account, then toggle like icon.
  if (
    Account.isRecipeLiked(
      isUser,
      isAPI,
      isUser ? state.user.userName : state.author.userName,
      // *- If recipe is from author |MODEL| access recipe ID with (.recipeID)
      state.recipeDetails.recipeID
        ? state.recipeDetails.recipeID
        : // *- If recipe is from API access id with (.id).
          state.recipeDetails.id
    )
  ) {
    // *- Toggle likeIcon on the recipe that is currently being displayed if it's liked.
    likesView.toggleLikeBtn(true);
  }
};

const controlInputFields = (property) => {
  DOMInputs.inputFirstName.style.display = `${property}`;
  DOMInputs.inputLastName.style.display = `${property}`;
};

const removeForm = (formType) => {
  formType.style.opacity = `0`;
  formType.style.visibility = `hidden`;
  DOMElements.backdrop.style.display = `none`;
};

// <===============================================================================>
// ============================== EVENT LITENERS ===================================
// <===============================================================================>

// ============================================================================
// || Event listeners for whenever browser window is loaded and for hashchange ||
// ============================================================================
[`load`, `hashchange`].forEach((event) => {
  window.addEventListener(event, () => {
    if (event === `load`) {
      controlAppLoad();
      controlLocalStorage();
    } else controlRecipes();
  });
});

// ===========================================
// || Event listener for pagination buttons ||
// ===========================================
DOMElements.recipesContainer.addEventListener(`click`, (event) => {
  controlPagination(event);
});

// ====================================
// || Event listener for Search form ||
// ====================================
DOMElements.searchForm.addEventListener(`submit`, (event) => {
  event.preventDefault();
  controlQuery();
});

// ===========================================
// || Event listener for create recipe button ||
// ===========================================
DOMButtons.createRecipeBtn.addEventListener(`click`, () => {
  validateCreateRecipe();
});

// ===============================================================================================
// || Event listeners for [`like button`, `close recipe button`, `ingredient pagination buttons`,
// || `How To cook button`, `Close instruction button`]
// ===============================================================================================
DOMElements.recipesSection.addEventListener(`click`, (event) => {
  // *- Event listener to paginate ingredients.
  if (event.target.closest(DOMClasses.ingredientButton)) {
    let page = parseInt(
      event.target.closest(DOMClasses.ingredientButton).dataset.goto
    );
    recipeView.paginateRecipeIngredient(
      state.isAuthorRecipeIng,
      state.recipeDetails.ingredients,
      page
    );
  }

  // *- If event target is delete recipe button.
  else if (event.target.closest(DOMClasses.btnDeleteRecipe)) {
    DOMElements.backdrop.style.display = `block`;
    // *- Render modal to confirm when deleting recipe.
    document.querySelector(DOMClasses.deleteRecipeModal).style.display = `flex`;
    // *- Create a isDeleteRecipe flag so when the delete recipe button is clicked,
    // *- And the hashchange event will be fired the recipe should not be displayed on the UI.
    // *- But render confirm modal.
    state.isDeleteRecipe = true;
  }

  // *- If event target is buttonYes which is used to confirm recipe deletion or buttonNo to remove confirm modal.
  else if (
    event.target.closest(DOMClasses.btnYes) ||
    event.target.closest(DOMClasses.btnNo)
  )
    controlRecipeDelete(event);
  // *- Event listener to render recipeInstructions.
  else if (event.target.closest(DOMClasses.recipeInstructionButton)) {
    const instructions = document.querySelector(DOMClasses.instructions);
    instructions.style.visibility = `visible`;
    instructions.style.opacity = `1`;
  }

  // *- Event listener to close recipeInstructions.
  else if (event.target.closest(DOMClasses.closeIngredientButton)) {
    const instructions = document.querySelector(DOMClasses.instructions);
    instructions.style.visibility = `hidden`;
    instructions.style.opacity = `0`;
  }

  // *- Event listener to remove recipeDetails.
  else if (event.target.closest(DOMClasses.closeRecipeButton)) {
    // *- Remove recipeDetails.
    recipeView.removeRecipeDetailsMarkup(true);
    // *- Set isAuthorRecipeIng flag to false since we removed recipe from UI.
    state.isAuthorRecipeIng = false;
    // *- Render searchForm and categories buttons.
    appElements(`visible`, `1`);
  } else if (event.target.closest(DOMClasses.likeButton)) validateRecipeLike();
});

// ===========================================
// || Event listener for categories buttons ||
// ===========================================
DOMElements.categoriesBox.addEventListener(`click`, (event) => {
  if (event.target.closest(DOMClasses.categoriesButton)) {
    // *- Get button text query to fetch recipe.
    const btnText = event.target.closest(DOMClasses.categoriesButton)
      .textContent;

    if (btnText.includes(`All`)) {
      // *- Remove Appload Recipes So it Won't duplicate
      searchView.removePrevRecipesMarkup();
      // *- Set isAuthorRecipes flag to false.
      state.isAuthorRecipes = false;
      controlAppLoad();
    } else controlQuery(btnText.trim());
  }
});

// ===========================================
// || Event listener for Login/Signup form ||
// ===========================================
DOMElements.formContainer.addEventListener(`click`, (event) => {
  event.preventDefault();
  if (
    event.target.closest(DOMClasses.loginButton) ||
    event.target.closest(DOMClasses.signupButton)
  )
    validateLoginSignup(
      // *- Pass the btn type (signup or login).
      event.target.className.split(` `)[2],
      state.isAuthor
    );
  // *- If event target is close form button.
  else if (event.target.closest(DOMClasses.closeRecipeFormButton)) {
    // *- Set isAuthor flag to false (This flag is used to check if author is active or not).
    // *- When ever like button is clicked, we only like recipe as user,
    // *- But to like it as author we need to sign up as author by clicking create recipe button.
    // *- And when that button is clicked, set isAuthor flag to true because we are using the app as author.
    // *- So when we like recipe it will saved in author dataStructure.
    // *- And when we log out as author, set the isAuthor flag to false.
    // *- And when author is logged out, we can only like recipe as user.
    state.isAuthor = false;
    removeForm(DOMElements.formContainer);
    // *- Clear previous fields.
    accountView.clearFields();
  }
});

// ===========================================
// || Event listener for Create recipes form ||
// ===========================================
DOMElements.createRecipeContainer.addEventListener(`click`, (event) => {
  event.preventDefault();
  if (event.target.closest(DOMClasses.closeCreateRecipeForm)) {
    // *- Remove recipe form from view.
    removeForm(DOMElements.createRecipeContainer);
    // *- Clear previous inputs
    authorRecipesView.clearFields();
  } else controlCreateRecipe(event);
});

// ==============================================
// || Event listener for logging out from account ||
// ==============================================
DOMElements.boxRight.addEventListener(`click`, (event) =>
  controlAccountMenu(event)
);
