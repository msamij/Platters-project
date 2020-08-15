import {
  DOMElements,
  DOMInputs,
  parseRecipeTitle,
  renderPaginationBtns,
} from "./base";

import * as baseMarkup from "./baseMarkup";

export const processRecipes = (
  recipes,
  isQuery = false,
  isAuthorRecipes,
  recipeBoxNo,
  page = 1,
  resPerPage = 2
) => {
  // *- Pagination Algorithm:
  // *- First we need to determine how many recipes we want to render per page (let's it's 3 recipes per page).
  // *- And we have total 9 recipes which are store in an array as objects.
  // *- So we need to have a startPoint and an endPoint for the array of recipes that we want to render.
  // *- Let's say that we want to render first three recipes which are stored in an array.
  // *- So the startPoint of the array would be (0) and endPoint would be (2) so it will render 3 recipes.
  // *- But to make it more dynamic we can say that the startPoint would be the page we (currently are in -1).
  // *- The page is let's say that page = 1 and so (1 - 1 = 0) * (resultsPerPage which is = 3) = 0 so the startpoint would be 0.
  // *- Which is exactly what we want so we start at 0 and end at page = 1 * resultsPerPage = 3 which would be 3.
  // *- So it will render first three recipes just as we defined startPoint = 0 and endPoint = 3.
  // *- And now let's say page is 2 and so this time it will render next three recipes.
  // *- So.. startPoint = (page = 2 - 1) = 1 * resultsPerPage = 3 which would be 3.
  // *- Before we started at 0 and ended at 3.
  // *- Now because we are rendering next page we will start at 3 and end at 6 and for next page we will start at 6 and end at 9.
  // *- So this will work exactly the same for every page.
  let startPoint = (page - 1) * resPerPage;
  let endPoint = page * resPerPage;

  // *- If we had passed in a recipeBoxNo that means we can do pagination.
  if (recipeBoxNo) {
    // *- First we will remove previous recipes from the recipe box based on the recipeBoxNo we have passed.
    removePrevRecipesMarkup(recipeBoxNo);
    // *- Recipes[] will contain recipes objects which will be rendered.
    // *- First we slice the recipes.
    // *- Example: let's say our recipes are {0:{....}, 1:{....}, 2:{....}, 3:{....}}
    // *- As we have already rendered first 3 recipes from 0 - 2 since the array is 0 based.
    // *- Now we will render from 3 - 5
    // *- So we slice it (from start to end) where recipeBoxNo is the actual object index in recipes array.
    // *- Basically there are 4 types of recipes objects in an array [obj1={..}, obj2={...}, obj3={...}, obj4={...}].
    // *- And each obj contains it's recipes for instance in obj1 there are 8 deserts recipes.
    // *- where each desert recipe is also an object.
    // *- And so the recipe object we will select will be based on the recipeBoxNo for instance "1".
    // *- And so we select recipe object 1 - 1 = 0 since array is zero based.
    // *- So we select deserts recipe object = {obj1:{....},obj2:{....},obj3:{....}}.
    // *- Slice it from startPoint to endPoint and then render it.
    // <=============================================================================================================>
    // *- If it's queryRecipe that means we only have one recipe array and inside that array we have our recipes.
    // *- But if it's not queryRecipe that means we have an array and inside that array we have array of different recipes.
    // *- Eg --> [[rec1], [rec2], [rec3]] here we have one array and inside that array we have different types of recipes array.
    // *- That's why it going to test the queryRecipe if it's queryRecipe it will access recipes like this: [{recObj1}, {recObj2}].
    // *- And if it's not queryRecipe,
    // *- It will get each recipe array inside our array which have all the recipes array --> [[rec1], [rec2], [rec3]]
    paginateRecipes(
      isQuery
        ? recipes.slice(startPoint, endPoint)
        : recipes[parseInt(recipeBoxNo) - 1].slice(startPoint, endPoint),
      isAuthorRecipes,
      recipeBoxNo,
      page,
      isQuery ? recipes.length : recipes[parseInt(recipeBoxNo) - 1].length,
      resPerPage
    );
  }
  // *- If we want to render recipe of the search query.
  else if (isQuery) {
    // *- Remove previous recipes markup.
    removePrevRecipesMarkup();

    DOMElements.recipesContainer.insertAdjacentHTML(
      `afterbegin`,
      baseMarkup.renderRecipes(
        recipes.slice(startPoint, endPoint),
        `1`,
        // *- Parse both recipes title.
        // *- First it will slice recipes based on startPoint and endPoint eg --> from startPoint = 1 - endPoint = 3.
        // *- So now we have new array of recipes since we slice it.
        // *- SLiced array --> [recipe1, recipe2]
        // *- Get first recipe title at index 0 and parseRecipeTitle and do the same for second recipe at index 1.
        parseRecipeTitle(recipes.slice(startPoint, endPoint)[0].title),
        parseRecipeTitle(recipes.slice(startPoint, endPoint)[1].title)
      )
    );
    renderPaginationBtns(page, `1`, recipes.length, resPerPage);
  }
  // *- Render All types of recipes.
  else {
    // *- First we will remove all previous recipes since we have skeleton loaders on appload.
    removePrevRecipesMarkup();
    // *- Then render all types of recipes.
    // *- On the first recipeBox it will render all pizzas recipes and so on.
    recipes.forEach((recipe, index) => {
      renderRecipes(
        recipe.slice(startPoint, endPoint),
        index + 1,
        page,
        recipe.length,
        resPerPage
      );
    });
  }
};

// <=================RENDERING RECIPES==================>
const renderRecipes = (recipe, recipeBoxNo, page, noOfResults, resPerPage) => {
  DOMElements.recipesContainer.insertAdjacentHTML(
    `beforeend`,
    baseMarkup.renderRecipes(
      recipe,
      recipeBoxNo,
      parseRecipeTitle(recipe[0].title),
      parseRecipeTitle(recipe[1].title)
    )
  );
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

const paginateRecipes = (
  recipe,
  isAuthorRecipes,
  recipeBoxNo,
  page,
  noOfResults,
  resPerPage
) => {
  isAuthorRecipes
    ? recipe.forEach((recipe) => {
        document
          .querySelector(`.recipes-${recipeBoxNo}`)
          .insertAdjacentHTML(
            "beforeend",
            baseMarkup.authorPaginationRecipe(
              recipe,
              parseRecipeTitle(recipe.title)
            )
          );
      })
    : recipe.forEach((recipe) => {
        document
          .querySelector(`.recipes-${recipeBoxNo}`)
          .insertAdjacentHTML(
            `beforeend`,
            baseMarkup.paginationRecipes(recipe, parseRecipeTitle(recipe.title))
          );
      });
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

// <=================REMOVING RECIPES===================>
export const removePrevRecipesMarkup = (recipeBoxNo) => {
  // *- If we are doing pagination of recipes, then we first need to remove prev recipes so that we can render next page of recipes.
  // *- Only remove prev recipes keep the pagination box in the DOM (Pagination contains pagination buttons).
  if (recipeBoxNo) {
    const recipesToRemove = document.querySelector(`.recipes-${recipeBoxNo}`)
      .childNodes;

    // *- Removing previous recipes from DOM.
    Array.from(recipesToRemove).forEach((recipe) => {
      recipe.parentElement.removeChild(recipe);
    });

    // *- Removing pagination buttons so that it won't duplicate when rendering again.
    removePaginationBtns(recipeBoxNo);
  }
  // *- When rendering recipes remove all prev recipes.
  else {
    const recipesBox = DOMElements.recipesContainer.childNodes;
    Array.from(recipesBox).forEach((el) => el.parentElement.removeChild(el));
  }
};

// <=================SKELETION RECIPES==================>
export const renderSkeletonRecipes = () =>
  DOMElements.recipesContainer.insertAdjacentHTML(
    `afterbegin`,
    baseMarkup.skeletonRecipes()
  );

export const clearSearchInput = () => (DOMInputs.searchInput.value = "");

const removePaginationBtns = (paginationBoxNo) => {
  // *- Selecting the correct btns box and removing buttons.
  const removeBtns = document.querySelectorAll(
    `.btn-pagination-box-${paginationBoxNo}`
  );

  removeBtns.forEach((btn) => {
    const btns = btn.childNodes;
    btns.forEach((el) => {
      el.parentElement.removeChild(el);
    });
  });
};
