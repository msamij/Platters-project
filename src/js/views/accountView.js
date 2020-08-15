import { DOMElements, DOMInputs } from "./base";
import * as baseMarkup from "./baseMarkup";

export const renderAccountMenu = (isAuthor, firstName, lastName) => {
  DOMElements.boxRight.insertAdjacentHTML(
    "afterbegin",
    isAuthor
      ? baseMarkup.renderAuthorAccountMenu(
          parseAccountName(firstName, lastName)
        )
      : baseMarkup.renderUserAccountMenu(parseAccountName(firstName, lastName))
  );
};

export const removeAccountMenu = (isAuthor) => {
  const accountMenu = document.querySelector(
    `.${isAuthor ? `author` : `user`}-account--box`
  );
  accountMenu.parentElement.removeChild(accountMenu);
};

export const clearFields = () => {
  [
    DOMInputs.inputFirstName,
    DOMInputs.inputLastName,
    DOMInputs.inputUserName,
    DOMInputs.inputPassword,
  ].forEach((input) => (input.value = ``));
};

export const firstNameValue = () => DOMInputs.inputFirstName.value;
export const lastNameValue = () => DOMInputs.inputLastName.value;
export const userNameValue = () => DOMInputs.inputUserName.value;
export const passwordValue = () => DOMInputs.inputPassword.value;

const parseAccountName = (firstName, lastName) => {
  // *- Split firstName and lastName into an array like this firstName = [`j`, `o`, `h`, `n`] and get the first letter.
  // *- From both parameters So let's say that fistName is `john` and lastName is `wick`
  // *- Split both firstName and lastName and get the first letter so --> name = [`j`, `w`] and finally join them together.
  firstName.split(``)[0], lastName.split(``)[0];

  let name = [];
  name.push(firstName.split(``)[0]);
  name.push(lastName.split(``)[0]);

  return name.join(``);
};
