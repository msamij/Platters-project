export const ID = require("uniqid");

export const apiKey = `566c523054244b38a477795508ded7be`;

export const DOMStrings = {
  searchForm: document.querySelector(`.search-form`),
  searchInput: document.querySelector(`.search-input`),
  createRecipeBox: document.querySelector(`.create-recipe-box`),
  boxRight: document.querySelector(`.box-right`),
  likesBox: document.querySelector(`.likes-box`),
  formContainer: document.querySelector(`.form-container`),
  accountForm: document.querySelector(`.account-form`),
  inputFirstName: document.querySelector(`.input-first-name`),
  inputLastName: document.querySelector(`.input-last-name`),
  inputUserName: document.querySelector(`.input-user-name`),
  inputPassword: document.querySelector(`.password`),
  categoriesBox: document.querySelector(`.categories-box`),
  recipesSection: document.querySelector(`.recipes-section`),
  recipesContainer: document.querySelector(`.recipes-container`),
  recipesBox: document.querySelectorAll(`.recipes-box`),
  message: document.querySelector(`.message`),
  successMessage: document.querySelector(`.success-message`),
  errorMessage: document.querySelector(`.error-message`),
  success: document.querySelector(`.success`),
  error: document.querySelector(`.error`),
  backdrop: document.querySelector(`.backdrop`),
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
