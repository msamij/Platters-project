import { ID } from "../views/base";

export default class Users {
  constructor(firstName, lastName, userName, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.userID = ID();
    (this.likedAPIRecipes = []), (this.likedAuthorRecipes = []);
  }
}
