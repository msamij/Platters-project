import { DOMStrings } from "./base";
import * as markupView from "./markupView";

export const processRecipes = (
  recipes,
  isQuery = false,
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
    // *- If it's queryRecipe that means we only have one recipe array so we don't do this [[rec1], [rec2], [rec3]].
    // *- Instead we only retrieve the actual recipes inside that array, like this ([recipe1{}, recipes2{}]).
    // *- Where each object is the actual recipe in the array Eg --> we have one array where we have 4 desert recipes objects.
    paginateRecipes(
      isQuery
        ? recipes.slice(startPoint, endPoint)
        : recipes[parseInt(recipeBoxNo) - 1].slice(startPoint, endPoint),
      recipeBoxNo,
      page,
      isQuery ? recipes.length : recipes[parseInt(recipeBoxNo) - 1].length,
      resPerPage
    );
  }
  // *- If we want to render recipe of the search query.
  else if (isQuery) {
    // *- Remove previos recipes markup.
    removePrevRecipesMarkup();

    // *- Parse recipe title.
    recipes.forEach((recipe) => {
      recipe.title = parseRecipeTitle(recipe.title);
    });

    DOMStrings.recipesContainer.insertAdjacentHTML(
      `afterbegin`,
      markupView.renderRecipes(recipes.slice(startPoint, endPoint), `1`)
    );
    renderPaginationBtns(page, `1`, recipes.length, resPerPage);
  }
  // *- Render All recipes.
  else {
    // *- First we will remove all previous recipes since we have skeleton loaders on appload.
    removePrevRecipesMarkup();
    // *- Then render all types of recipes.
    // *- On the first recipeBox it will render all pizzas recipes.
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
  recipe.forEach((recipe) => {
    recipe.title = parseRecipeTitle(recipe.title);
  });
  DOMStrings.recipesContainer.insertAdjacentHTML(
    `beforeend`,
    markupView.renderRecipes(recipe, recipeBoxNo)
  );
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

const paginateRecipes = (
  recipe,
  recipeBoxNo,
  page,
  noOfResults,
  resPerPage
) => {
  recipe.forEach((recipe) => {
    recipe.title = parseRecipeTitle(recipe.title);
    document
      .querySelector(`.recipes-${recipeBoxNo}`)
      .insertAdjacentHTML(`beforeend`, markupView.paginationRecipes(recipe));
  });
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

// <=================REMOVING RECIPES===================>
export const removePrevRecipesMarkup = (recipeBoxNo) => {
  // *- If we are doing pagination of recipes, then we first need to remove prev recipes so that we can render next page of recipes.
  // *- Only remove prev recipes keep the pagination box in the DOM (Pagination box is what holds pagination buttons).
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
    const recipesBox = DOMStrings.recipesContainer.childNodes;
    Array.from(recipesBox).forEach((el) => el.parentElement.removeChild(el));
  }
};

// <=================SKELETION RECIPES==================>
export const renderSkeletonRecipes = () =>
  DOMStrings.recipesContainer.insertAdjacentHTML(
    `afterbegin`,
    markupView.skeletonRecipes()
  );

export const clearSearchInput = () => (DOMStrings.searchInput.value = "");

// <=================PAGINATION RECIPES=================>
const renderPaginationBtns = (page, recipeBoxNo, noOfResults, resPerPage) => {
  // *- Initially we set the page to 1.
  // *- Let's say that there are 3 Total pages.
  // *- And we are on page 1 when we are on first page and there are more pages only render next button.
  // *- When rendering next button set data attribute to page which is let's 1 to page + 1.
  // *- So if are on page 1 and we want to goto second page we will set data attribute for next button to page + 1.
  // *- For going backwards it's exactly same with (page is 2) (so 2 - 1) = 1 so we are on second page and we want to go to first page.
  // *- So it would be 1.
  let totalPages = Math.ceil(noOfResults / resPerPage);
  let recipeBox = document.querySelector(`.recipes-box-${recipeBoxNo}`);

  // *- If we are on first page and there's an another page then render next button.
  // *- If button is next it will insert in the last child of recipeBox which is (btn-pagination-box-next), Look in the markup.
  if (page === 1 && page < totalPages) {
    recipeBox.lastElementChild.insertAdjacentHTML(
      `afterbegin`,
      markupView.paginationbtn(`next`, page)
    );
  }

  // *- If we are on one of the middle page that means we can go both ways so render both buttons.
  else if (page > 1 && page < totalPages) {
    recipeBox.firstElementChild.insertAdjacentHTML(
      `afterbegin`,
      markupView.paginationbtn(`prev`, page)
    );

    recipeBox.lastElementChild.insertAdjacentHTML(
      `afterbegin`,
      markupView.paginationbtn(`next`, page)
    );
  }

  // *- If we are on the last page that means we can only go backwards so render only prev button.
  // *- If button is previous it will insert in the first child of recipeBox which is (btn-pagination-box-prev), Look in the markup.
  else if (page === totalPages) {
    recipeBox.firstElementChild.insertAdjacentHTML(
      `afterbegin`,
      markupView.paginationbtn(`prev`, page)
    );
  }
};

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

const parseRecipeTitle = (title, limit = 13) => {
  const strArr = title.split(" ");
  // const signs = ["-", ":", "=", ",", "/", "–"];
  const signs = [
    `:`,
    `-`,
    `=`,
    `,`,
    `$`,
    `!`,
    `@`,
    `#`,
    `^`,
    `&`,
    `/`,
    `%`,
    `(`,
    `)`,
    `?`,
    `~`,
    `;`,
    `<`,
    `>`,
  ];

  // *- (Let's pretend that there are signs in a string).
  // *- 1: Split title into an array so that we can apply loop.
  // *- 2: Check if any element in a string contains a signs, (Check every signs for every elements in a string).
  // *- 3: If there's a sign in replace it with "".
  strArr.forEach((el, index) => {
    signs.forEach((sign) => {
      if (el.includes(sign)) {
        strArr[index] = el.replace(sign, " ");
      }
    });
  });

  // *- 4: Now that we replaced sign element with "" so we have to remove that extra "".
  // *- 5: Again looping over every element and check if there's an "" and remove it.
  strArr.forEach((el, index) => {
    if (el === " ") strArr.splice(index, 1);
  });

  // *- TITLE limit is 13
  // *- (Let's say that title is > limit).
  // *- Example Title = (Home made pizza veggies).
  // *- 1: Split title into an array so that we can apply loop.
  // *- 2: Set curValue to first element of array (curValue = "Home").
  // *- 3: If curValue ("Home".length = 4) + ["made".length] which is 2nd element in array <= limit.
  // *- 4: Join these two strings since it's < limit and set (title to curValue with space between and next title in array).
  // *- 5: Now title is "Home made" where "Home" is curValue (space in between) and next element in array which is "made".
  // *- 6: Loop keep adding title until is < limit.
  // *- 7: When title is > limit it adds "..." at the end of title (meaning that title length is now > limit) and finally it returns title.
  if (title.length > limit) {
    let curValue = strArr[0];
    for (let index = 0; index < strArr.length - 1; index++) {
      if (curValue.length + strArr[index + 1].length <= limit) {
        title = curValue += " " + strArr[index + 1];
      } else {
        title = curValue + "...";
        break;
      }
    }
    return title;
  } else return title;
};
