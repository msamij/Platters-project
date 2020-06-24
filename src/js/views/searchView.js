import { DOMStrings } from "./base";

export const processRecipes = (
  recipes,
  recipeBoxNo,
  page = 1,
  resPerPage = 3
) => {
  let startPoint = (page - 1) * resPerPage;
  let endPoint = page * resPerPage;

  // *- If we had passed in a recipeBoxNo that means we can do pagination.
  if (recipeBoxNo) {
    // *- First we will remove previous recipes from the recipe box based on the recipeBoxNo we have passed.
    removePrevRecipesMarkup(recipeBoxNo);
    // *- Recipes[] will contain recipes objects which will be rendered.
    // *- First we slice the recipes.
    // *- Example: let's say our recipes are {0:{....}, 1:{....}, 2:{....}, 3:{....}}
    // *- As we have already rendered first 3 recipes from 0 - 2 as the array is 0 based.
    // *- Now we will render from 3 - 5
    // *- So we slice it (from start to end) where recipeBoxNo is the actual object index in recipes array.
    // *- Basically there are 4 types of recipes objects in an array [obj1={..}, obj2={...}, obj3={...}, obj4={...}].
    // *- And each obj contains it's recipes for instance in obj1 there are 8 deserts recipes.
    // *- where each desert recipe is also an object.
    // *- And so the recipe object we will select will be based on the recipeBoxNo for instance "1".
    // *- And so we select recipe object 1 - 1 = 0 since array is zero based.
    // *- So we select deserts recipe object = {obj1:{....},obj2:{....},obj3:{....}}.
    // *- Slice it from startPoint to endPoint and then render it.
    paginateRecipes(
      recipes[parseInt(recipeBoxNo) - 1].slice(startPoint, endPoint),
      recipeBoxNo,
      page,
      recipes[parseInt(recipeBoxNo) - 1].length,
      resPerPage
    );
  } else {
    // *- First we will remove all previous recipes since we have skeleton loader on appload.
    removePrevRecipesMarkup();
    // *- Then render all types of recipes according to the recipeBoxNo.
    // *- For instance on the first recipeBox we will render all pizzas recipes and so on...
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

const renderRecipes = (recipe, recipeBoxNo, page, noOfResults, resPerPage) => {
  const recipeMarkup = `<div class="recipes-box recipes-box-${recipeBoxNo}">
          <div class="btn-pagination-box btn-pagination-box-${recipeBoxNo} btn-pagination-box-prev"></div>
          
          <div class="recipes recipes-${recipeBoxNo}">
          <a href="#${recipe[0].id}" class="recipe">
            <div class="img-box">
              <img
                src="https://spoonacular.com/recipeImages/${
                  recipe[0].id
                }-636x393.jpg"
                alt="${parseRecipeTitle(recipe[0].title)}"
              />
            </div>
            <span class="recipe-title">${parseRecipeTitle(
              recipe[0].title
            )}</span>
          </a>

          <a href="#${recipe[1].id}" class="recipe">
            <div class="img-box">
              <img
                src="https://spoonacular.com/recipeImages/${
                  recipe[1].id
                }-636x393.jpg"
                alt="${parseRecipeTitle(recipe[1].title)}"
              />
            </div>
            <span class="recipe-title">${parseRecipeTitle(
              recipe[1].title
            )}</span>
          </a>

          <a href="#${recipe[2].id}" class="recipe">
            <div class="img-box">
              <img
                src="https://spoonacular.com/recipeImages/${
                  recipe[2].id
                }-636x393.jpg"
                alt="${parseRecipeTitle(recipe[2].title)}"
              />
            </div>
            <span class="recipe-title">${parseRecipeTitle(
              recipe[2].title
            )}</span>
          </a>
          
      </div>
      <div class="btn-pagination-box btn-pagination-box-${recipeBoxNo} btn-pagination-box-next"></div>
    </div>`;

  DOMStrings.recipesContainer.insertAdjacentHTML("beforeend", recipeMarkup);
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

const paginateRecipes = (
  recipe,
  recipeBoxNo,
  page,
  noOfResults,
  resPerPage
) => {
  let recipeMarkup;
  recipe.forEach((recipe) => {
    recipeMarkup = `
      <a href="#${recipe.id}" class="recipe">
          <div class="img-box">
            <img
              src="https://spoonacular.com/recipeImages/${
                recipe.id
              }-636x393.jpg"
              alt="${parseRecipeTitle(recipe.title)}"
            />
          </div>
          <span class="recipe-title">${parseRecipeTitle(recipe.title)}</span>
      </a>`;

    document
      .querySelector(`.recipes-${recipeBoxNo}`)
      .insertAdjacentHTML("beforeend", recipeMarkup);
  });
  renderPaginationBtns(page, recipeBoxNo, noOfResults, resPerPage);
};

export const removePrevRecipesMarkup = (recipeBoxNo) => {
  // *- If we are doing pagination of recipes, then we first need to remove prev recipes so that we can render next page of recipes.
  // *- Only remove prev recipes keep the pagination box in the DOM (Pagination box is what holds pagination buttons).
  if (recipeBoxNo) {
    const recipesToRemove = document.querySelector(`.recipes-${recipeBoxNo}`)
      .children;

    // *- Removing previous recipes from DOM.
    Array.from(recipesToRemove).forEach((recipe) => {
      recipe.parentElement.removeChild(recipe);
    });

    // *- Removing pagination buttons so that it won't duplicate when rendering again.
    removePaginationBtns(recipeBoxNo);
  }
  // *- When rendering recipes on appload remove all the recipes skeleton.
  else {
    DOMStrings.recipesBox.forEach((el) => {
      el.parentElement.removeChild(el);
    });
  }
};

const renderPaginationBtns = (page, recipeBoxNo, noOfResults, resPerPage) => {
  let totalPages = Math.ceil(noOfResults / resPerPage);
  let btnMarkup;
  let recipeBox = document.querySelector(`.recipes-box-${recipeBoxNo}`);

  // *- If we are on first page and there's an another page then render next button.
  // *- If button is next it will insert in the last child of recipeBox which is (btn-pagination-box-next), Look in the markup.
  if (page === 1 && page < totalPages) {
    btnMarkup = `<button class="btn-default btn-pagination btn-next" data-goto="${
      page + 1
    }">
        <i class="fas fa-angle-right"></i>
      </button>`;
    recipeBox.lastElementChild.insertAdjacentHTML("afterbegin", btnMarkup);
  }

  // *- If we are on one of the middle page at that point we can go both ways so render both buttons.
  else if (page > 1 && page < totalPages) {
    btnMarkup = `<button
        class="btn-default btn-pagination btn-prev"
        data-goto="${page - 1}"
      >
        <i class="fas fa-angle-left"></i>
      </button>`;
    recipeBox.firstElementChild.insertAdjacentHTML("afterbegin", btnMarkup);

    btnMarkup = `<button class="btn-default btn-pagination btn-next" data-goto="${
      page + 1
    }">
        <i class="fas fa-angle-right"></i>
      </button>`;
    recipeBox.lastElementChild.insertAdjacentHTML("afterbegin", btnMarkup);
  }

  // *- If we are on the last page that means we can only go backwards so render only prev button.
  // *- If button is previous it will insert in the first child of recipeBox which is (btn-pagination-box-prev), Look in the markup.
  else if (page === totalPages) {
    btnMarkup = `<button
        class="btn-default btn-pagination btn-prev"
        data-goto="${page - 1}"
      >
        <i class="fas fa-angle-left"></i>
      </button>`;
    recipeBox.firstElementChild.insertAdjacentHTML("afterbegin", btnMarkup);
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
  const signs = ["-", ":", "=", ",", "/", "–"];

  // *- (Let's pretend that there are signs in a string).
  // *- 1: Split title into an array so that we can apply loop.
  // *- 2: Check if any element in a string contains a signs, (Check every signs for every elements in a string).
  // *- 3: If there's a sign in replace it with "".
  strArr.forEach((el, index) => {
    signs.forEach((sign) => {
      if (el.search(sign) > -1) {
        strArr[index] = el.replace(sign, "");
      }
    });
  });

  // *- 4: Now that we replaced sign element with "" so we have to remove that extra "".
  // *- 5: Again looping over every element and check if there's an "" and remove it.
  strArr.forEach((el, index) => {
    if (el === "") strArr.splice(index, 1);
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
