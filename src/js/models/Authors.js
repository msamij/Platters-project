import Account from "../views/base";
import { ID } from "../views/base";

export default class Authors extends Account {
  constructor(firstName, lastName, userName, password) {
    super(firstName, lastName, userName, password);
    this.authorID = ID();
    this.recipes = [];
    (this.likedAPIRecipes = []), (this.likedAuthorRecipes = []);
  }
}
