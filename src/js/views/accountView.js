import { DOMStrings } from "./base";
import * as markupView from "./markupView";

export const renderAccountMenu = (isAuthor, firstName, lastName) => {
  DOMStrings.boxRight.insertAdjacentHTML(
    "afterbegin",
    isAuthor
      ? markupView.renderAuthorAccountMenu(
          parseAccountName(firstName, lastName)
        )
      : markupView.renderUserAccountMenu(parseAccountName(firstName, lastName))
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
    DOMStrings.inputFirstName,
    DOMStrings.inputLastName,
    DOMStrings.inputUserName,
    DOMStrings.inputPassword,
  ].forEach((input) => (input.value = ``));
};

export const firstNameValue = () => DOMStrings.inputFirstName.value;
export const lastNameValue = () => DOMStrings.inputLastName.value;
export const userNameValue = () => DOMStrings.inputUserName.value;
export const passwordValue = () => DOMStrings.inputPassword.value;

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
