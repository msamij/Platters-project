import Account from "../views/base";
import { ID } from "../views/base";

export default class Users extends Account {
  constructor(firstName, lastName, userName, password) {
    super(firstName, lastName, userName, password);
    this.userID = ID();
    (this.likedAPIRecipes = []), (this.likedAuthorRecipes = []);
  }
}
