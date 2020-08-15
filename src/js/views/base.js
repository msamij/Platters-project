import * as baseMarkup from "./baseMarkup";

export const ID = require("uniqid");

export const apiKey = `566c523054244b38a477795508ded7be`;

export const DOMElements = {
  searchForm: document.querySelector(`.search-form`),
  createRecipeBox: document.querySelector(`.create-recipe-box`),
  createRecipeContainer: document.querySelector(`.create-recipe-container`),
  boxRight: document.querySelector(`.box-right`),
  likesBox: document.querySelector(`.likes-box`),
  formContainer: document.querySelector(`.form-container`),
  formText: document.querySelector(`.form-text`),
  categoriesBox: document.querySelector(`.categories-box`),
  recipesSection: document.querySelector(`.recipes-section`),
  recipesContainer: document.querySelector(`.recipes-container`),
  mostLikedRecipesContainer: document.querySelector(
    `.most-liked-recipes--container`
  ),
  successMessage: document.querySelector(`.success-message`),
  errorMessage: document.querySelector(`.error-message`),
  success: document.querySelector(`.success`),
  error: document.querySelector(`.error`),
  backdrop: document.querySelector(`.backdrop`),
};

export const DOMClasses = {
  recipeViewContainer: `.recipe-view-container`,
  ingredientList: `.ingredient-list`,
  recipeDetailsBox: `.recipe-details-box`,
  recipeInstructionBtnBox: `.recipe-instruction-btn-box`,
  deleteRecipeModal: `.delete-recipe-modal`,
  IngredientBtnBox: `.btn-ingredient-box`,
  IngredientBtnBoxNext: `.ingredient-btn-box-next`,
  IngredientBtnBoxPrev: `.ingredient-btn-box-prev`,
  paginationButton: `.btn-pagination`,
  ingredientButton: `.btn-ingredient`,
  recipeInstructionButton: `.recipe-instructions-btn`,
  instructions: `.instructions`,
  closeIngredientButton: `.btn-close-ingredient`,
  closeRecipeButton: `.btn-close-recipe`,
  likeButton: `.like-btn`,
  likedItems: `.liked-items`,
  categoriesButton: `.btn-categories`,
  loginButton: `.btn-login`,
  logoutButton: `.logout-btn`,
  signupButton: `.btn-signup`,
  closeRecipeFormButton: `.btn-close-form`,
  closeCreateRecipeForm: `.btn-close-create-recipe`,
  btnViewRecipe: `.view-recipe-btn`,
  btnSaveRecipe: `.btn-save-recipe`,
  btnNewRecipe: `.btn-new-recipe`,
  btnNewIngredient: `.btn-new-ingredient`,
  btnSaveIngredient: `.btn-save-ingredient`,
  btnDeleteRecipe: `.delete-recipe-btn`,
  btnYes: `.btn-yes`,
  btnNo: `.btn-no`,
};

export const DOMInputs = {
  searchInput: document.querySelector(`.search-input`),
  inputFirstName: document.querySelector(`.input-first-name`),
  inputLastName: document.querySelector(`.input-last-name`),
  inputUserName: document.querySelector(`.input-user-name`),
  inputPassword: document.querySelector(`.password`),
  inputRecipeName: document.querySelector(`.input-recipe--name`),
  inputImgUrl: document.querySelector(`.input-img-url`),
  inputInstructions: document.querySelector(`.input_instructions`),
  inputIngredient: document.querySelector(`.input-ingredient`),
};

export const DOMButtons = {
  createRecipeBtn: document.querySelector(`.create-recipe-btn`),
  btnNewIngredient: document.querySelector(`.btn-new-ingredient`),
  btnSaveIngredient: document.querySelector(`.btn-save-ingredient`),
};

// ******/ SUPER CLASS FOR USER AND AUTHOR ACCOUNT CLASSES \******
export default class Account {
  constructor(firstName, lastName, userName, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
  }
}

export const renderPaginationBtns = (
  page,
  recipeBoxNo,
  noOfResults,
  resPerPage
) => {
  // *- Initially we set the page to 1.
  // *- Let's say that there are 3 Total pages.
  // *- And we are on page 1 when we are on first page and there are more pages only render next button.
  // *- When rendering next button set data attribute to page which is let's 1 to page + 1.
  // *- So if are on page 1 and we want to goto second page we will set data attribute for next button to page + 1.
  // *- For going backwards it's exactly same with (page is 2) (so 2 - 1) = 1 so we are on second page and we want to go to first page.
  // *- So it would be 1.
  let totalPages = Math.ceil(noOfResults / resPerPage);
  let recipeBox = document.querySelector(`.recipes-box-${recipeBoxNo}`);

  if (noOfResults > resPerPage) {
    // *- If we are on first page and there's an another page then render next button.
    // *- If button is next it will insert in the last child of recipeBox which is (btn-pagination-box-next), Look in the markup.
    if (page === 1 && page < totalPages) {
      recipeBox.lastElementChild.insertAdjacentHTML(
        `afterbegin`,
        baseMarkup.paginationbtn(`next`, page)
      );
    }

    // *- If we are on one of the middle page that means we can go both ways so render both buttons.
    else if (page > 1 && page < totalPages) {
      recipeBox.firstElementChild.insertAdjacentHTML(
        `afterbegin`,
        baseMarkup.paginationbtn(`prev`, page)
      );

      recipeBox.lastElementChild.insertAdjacentHTML(
        `afterbegin`,
        baseMarkup.paginationbtn(`next`, page)
      );
    }

    // *- If we are on the last page that means we can only go backwards so render only prev button.
    // *- If button is previous it will insert in the first child of recipeBox which is (btn-pagination-box-prev), Look in the markup.
    else if (page === totalPages) {
      recipeBox.firstElementChild.insertAdjacentHTML(
        `afterbegin`,
        baseMarkup.paginationbtn(`prev`, page)
      );
    }
  }
};

export const parseRecipeTitle = (title, limit = 13) => {
  const strArr = title.split(" ");

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
        strArr[index] = el.replace(sign, ``);
      }
    });
  });

  // *- 4: Now that we replaced sign element with "" so we have to remove that extra "".
  // *- 5: Again looping over every element and check if there's an "" and remove it.
  strArr.forEach((el, index) => {
    if (el === ``) strArr.splice(index, 1);
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
        title = curValue += ` ` + strArr[index + 1];
      } else {
        title = curValue + `...`;
        break;
      }
    }
    return title;
  } else return title;
};
