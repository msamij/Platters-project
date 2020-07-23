import { DOMStrings } from "./base";
import * as markupView from "./markupView";

export const processRecipeDetails = (recipe) => {
  // *- Parse the recipe title.
  recipe.title = parseRecipeTitle(recipe.title);

  // *- Will Render Recipe Which was clicked.
  document
    .querySelector(`.recipe-view-container`)
    .insertAdjacentHTML(`afterbegin`, markupView.renderRecipeDetails(recipe));
  // *- If there are ingredients and instructions render them on the UI.
  if (recipe.ingredients) renderRecipeIngredients(recipe.ingredients);
  if (recipe.instructions)
    renderRecipeInstructions(
      recipe.instructions,
      recipe.sourceName,
      recipe.sourceUrl
    );
};

// *- If close recipe button is clicked, it will remove current recipe from DOM and DISPLAYS previous recipes.
// *- Otherwise it will remove skeleton recipe.
export const removeRecipeDetailsMarkup = (backToRecipes) => {
  if (backToRecipes) {
    const recipeDetails = document.querySelector(`.recipe-view-container`);
    recipeDetails.parentElement.removeChild(recipeDetails);
  } else {
    const childNodes = document.querySelector(`.recipe-view-container`)
      .childNodes;
    Array.from(childNodes).forEach((child) => {
      child.parentElement.removeChild(child);
    });
  }
};

export const prevRecipeDetails = () =>
  document.querySelector(`.recipe-view-container`);

// *- Will render skeleton for recipe.
export const renderSkeletonRecipeDetails = () =>
  DOMStrings.recipesSection.insertAdjacentHTML(
    `beforeend`,
    markupView.skeletonRecipeDetails()
  );

// *- Paginate Ingredients.
export const paginateRecipeIngredient = (ingredients, page, resPerPage = 5) => {
  // *- Parse the ingredients.
  ingredients = ingredients.map((ing) => ing.originalString);
  ingredients = parseRecipeIngredients(ingredients);

  const startPoint = (page - 1) * resPerPage;
  const endPoint = page * resPerPage;

  // *- Remove prev ingredients.
  removePrevIngredients();
  // *- Remove pagination buttons.
  removeIngButtons();

  // *- Render Recipe ingredients.
  ingredients.slice(startPoint, endPoint).forEach((ing) => {
    document
      .querySelector(`.ingredient-list`)
      .insertAdjacentHTML(`beforeend`, markupView.renderIngredient(ing));
  });
  // *- Render ingredient pagination buttons.
  renderIngredientBtns(page, ingredients.length, resPerPage);
};

// *- Render ingredients.
const renderRecipeIngredients = (ingredients, page = 1, resPerPage = 5) => {
  // *- Parse the ingredients.
  ingredients = ingredients.map((ing) => ing.originalString);
  ingredients = parseRecipeIngredients(ingredients);

  const startPoint = (page - 1) * resPerPage;
  const endPoint = page * resPerPage;

  // *- Render the ingredientsMarkup.
  document
    .querySelector(`.recipe-details-box`)
    .insertAdjacentHTML(`afterbegin`, markupView.ingredientsMarkup());

  // *- Render ingredients.
  ingredients.slice(startPoint, endPoint).forEach((ing) => {
    document
      .querySelector(`.ingredient-list`)
      .insertAdjacentHTML(`beforeend`, markupView.renderIngredient(ing));
  });
  // *- Render ingredient pagination buttons.
  renderIngredientBtns(page, ingredients.length, resPerPage);
};

// *- Render Recipe instructions.
const renderRecipeInstructions = (instructions, sourceName, sourceUrl) => {
  document
    .querySelector(`.recipe-details-box`)
    .insertAdjacentHTML(
      `beforeend`,
      markupView.renderInstructionBtn(sourceUrl, sourceName)
    );
  document
    .querySelector(`.recipe-instruction-btn-box`)
    .insertAdjacentHTML(
      `beforeend`,
      markupView.renderRecipeInstructions(instructions)
    );
};

// *- Render ingredient pagination buttons.
const renderIngredientBtns = (page, noOfResults, resPerPage) => {
  let totalPages = Math.ceil(noOfResults / resPerPage);

  if (noOfResults > resPerPage) {
    if (page === 1 && page < totalPages) {
      document
        .querySelector(`.ingredient-btn-box-next`)
        .insertAdjacentHTML(
          `beforeend`,
          markupView.ingredientButtons(`next`, page)
        );
    } else if (page > 1 && page < totalPages) {
      document
        .querySelector(`.ingredient-btn-box-prev`)
        .insertAdjacentHTML(
          `afterbegin`,
          markupView.ingredientButtons(`prev`, page)
        );
      document
        .querySelector(`.ingredient-btn-box-next`)
        .insertAdjacentHTML(
          `beforeend`,
          markupView.ingredientButtons(`next`, page)
        );
    } else if (page === totalPages) {
      document
        .querySelector(`.ingredient-btn-box-prev`)
        .insertAdjacentHTML(
          `afterbegin`,
          markupView.ingredientButtons(`prev`, page)
        );
    }
  }
};

// *- Remove previous ingredients.
const removePrevIngredients = () => {
  const prevIng = document.querySelector(`.ingredient-list`).childNodes;
  Array.from(prevIng).forEach((ing) => ing.parentElement.removeChild(ing));
};

// *- Remove previous ingredient buttons.
const removeIngButtons = () => {
  const btnsBox = document.querySelectorAll(`.btn-ingredient-box`);
  btnsBox.forEach((btnBox) => {
    const btn = btnBox.childNodes;
    btn.forEach((btn) => btn.parentElement.removeChild(btn));
  });
};

const parseRecipeTitle = (title) => {
  const signs = [
    `:`,
    `=`,
    `,`,
    `-`,
    `$`,
    `!`,
    `@`,
    `#`,
    `^`,
    `*`,
    `&`,
    `%`,
    `?`,
    `~`,
    `;`,
    `<`,
    `>`,
  ];

  const strArr = title.split(` `);
  strArr.forEach((el, index) => {
    signs.forEach((sign) => {
      if (el.includes(sign)) {
        strArr[index] = el.replace(sign, ` `);
      }
    });
  });
  strArr.forEach((el, index) => {
    if (el === ` `) strArr.splice(index, 1);
  });
  return strArr.join(` `);
};

const parseRecipeIngredients = (ingredients) => {
  // *- Split ingredients into multiple arrays --> like this ing1 = [["1"], ["cup"], ["canned"], ["apricot"]].
  // *- So that each of them can be parsed.
  let newIng = [];
  ingredients.forEach((ing, index) => {
    newIng[index] = ing.split(" ");
  });

  const qty = [
    `tablespoon`,
    `tablespoons`,
    `teaspoon`,
    `teaspoons`,
    `ounce`,
    `ounces`,
  ];

  const parsedQty = [`tbsp`, `tbsp`, `tsp`, `tsp`, `oz`, `oz's`];

  const signs = [
    `:`,
    `=`,
    `,`,
    `-`,
    `$`,
    `!`,
    `@`,
    `#`,
    `^`,
    `*`,
    `&`,
    `%`,
    `?`,
    `~`,
    `;`,
    `<`,
    `>`,
  ];

  // *- Loop through every element in the array.
  // *- And if there's and qty replace it with parsedQty.
  newIng.forEach((ingArr) => {
    ingArr.forEach((ing, indexx) => {
      qty.forEach((qty, index) => {
        if (ing.includes(qty)) {
          ingArr[indexx] = ing.replace(qty, parsedQty[index]);
        }
      });
    });
  });

  // *- Loop through every element.
  // *- If first element in array can be parsed to number, something like this, (1/3) then skip this element and don't remove any sign.
  //*- Check other elements in array and remove signs (if any).
  newIng.forEach((ingArr) => {
    if (parseInt(ingArr[0])) {
      ingArr.slice(1).forEach((ing, index) => {
        signs.forEach((sign) => {
          if (ing.includes(sign)) {
            // *- Here we set index + 1 that's because we skip the first element.
            // *- So let's element 2 have the sign and index is at 0 so that's why we have to add + 1.
            // *- Because index always starts at 0 even if we skip the first element.
            ingArr[index + 1] = ing.replace(sign, ``);
          }
        });
      });
    } else {
      ingArr.forEach((ing, index) => {
        signs.forEach((sign) => {
          if (ing.includes(sign)) {
            ingArr[index] = ing.replace(sign, ``);
          }
        });
      });
    }
  });

  // *- Since we remove the sign and added "".
  // *- Now we need to remove "".
  newIng.forEach((ingArr) => {
    ingArr.forEach((ing, index) => {
      if (ing === "") ingArr.splice(index, 1);
    });
  });

  // *- Converting it back to normal array.
  // *- Since we split it into multiple arrays in an array --> like this [[], [], [], [], []]
  // *- Now we only have one array and in there we have ingredient strings --> like this ["", "", "", "", "", ""].
  // *- We do this so that we can loop easily and render ingredients on the UI.
  newIng.forEach((ingArr, index) => {
    newIng[index] = ingArr.join(` `);
  });

  return newIng;
};
