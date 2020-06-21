import { DOMStrings } from "./base";

export const processRecipes = (
  recipes,
  recipeBoxNo,
  page = 1,
  resPerPage = 3
) => {
  let startPoint = (page - 1) * resPerPage;
  let endPoint = page * resPerPage;
  removePrevRecipesMarkup();

  if (recipeBoxNo) {
    renderRecipes(
      recipes.slice(startPoint, endPoint),
      recipeBoxNo,
      page,
      recipes.length,
      3
    );
  } else {
    recipes.forEach((recipe, index) => {
      renderRecipes(recipe.slice(startPoint, endPoint), index + 1);
    });
  }
};

const renderRecipes = (recipe, recipeBoxNo, page, noOfResults, resPerPage) => {
  let totalPages = noOfResults / resPerPage;

  const recipeMarkup = `<div class="recipes-box recipes-box-${recipeBoxNo} pizza-recipes">
      <button class="btn-default btn-pagination btn-prev">
        <i class="fas fa-angle-left"></i>
      </button>

      <a href="#${recipe[0].id}" class="recipe pizza-recipe">
        <div class="img-box">
          <img src="https://spoonacular.com/recipeImages/${
            recipe[0].id
          }-636x393.jpg" alt="${parseRecipeTitle(recipe[0].title)}" />
        </div>
        <span class="recipe-title">${parseRecipeTitle(recipe[0].title)}</span>
      </a>

      <a href="#${recipe[1].id}" class="recipe pizza-recipe">
        <div class="img-box">
          <img
            src="https://spoonacular.com/recipeImages/${
              recipe[1].id
            }-636x393.jpg"
            alt="${parseRecipeTitle(recipe[1].title)}"
          />
        </div>
        <span class="recipe-title">${parseRecipeTitle(recipe[1].title)}</span>
      </a>

      <a href="#${recipe[2].id}" class="recipe pizza-recipe">
        <div class="img-box">
          <img src="https://spoonacular.com/recipeImages/${
            recipe[2].id
          }-636x393.jpg" alt="${parseRecipeTitle(recipe[2].title)}" />
        </div>
        <span class="recipe-title">${parseRecipeTitle(recipe[2].title)}</span>
      </a>

      <button class="btn-default btn-pagination btn-next">
        <i class="fas fa-angle-right"></i>
      </button>
    </div>`;
  DOMStrings.recipesContainer.insertAdjacentHTML("beforeend", recipeMarkup);
};

const parseRecipeTitle = (title, limit = 13) => {
  const strArr = title.split(" ");
  const signs = ["-", ":", "=", ",", "/"];

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
  } else return (title = string);
};

const removePrevRecipesMarkup = () => {
  DOMStrings.recipesBox.forEach((el) => {
    el.parentElement.removeChild(el);
  });
};
