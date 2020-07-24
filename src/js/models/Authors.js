import { ID } from "../views/base";

export default class Authors {
  constructor(firstName, lastName, userName, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.authorID = ID();
    this.recipes = [];
    (this.likedAPIRecipes = []), (this.likedAuthorRecipes = []);
  }
}
