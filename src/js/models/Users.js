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

  static checkUser(userName, password) {
    let isUser = false;
    data.users.forEach((user) => {
      if (user.userName === userName && user.password === password)
        isUser = user;
    });
    return isUser;
  }

  static isUserName(userName) {
    let isUserName = false;
    data.users.forEach((user) => {
      if (user.userName === userName) isUserName = user;
    });
    return isUserName;
  }

  saveUser(obj) {
    data.users.push(obj);
  }

  isRecipeLiked(isAPIRecipe, userName, ID) {
    // *- First validate that recipe is from API or from AUTHOR MODEL.
    // *- Then validate that user with the userName has already liked the recipe.
    // *- If recipe is liked, then return true otherwise return false.
    let isRecipeLiked = false;
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.forEach((recipe) => {
              if (recipe.id === ID) isRecipeLiked = true;
            });
          }
        })
      : data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.forEach((recipe) => {
              if (recipe.id === ID) isRecipeLiked = true;
            });
          }
        });
    return isRecipeLiked;
  }

  getLikedRecipes(userName) {
    let IDs = [];
    data.users.forEach((user) => {
      if (user.userName === userName) {
        if (user.likedAPIRecipes.length > 0)
          user.likedAPIRecipes.forEach((recipe) => IDs.push(recipe));
        else if (user.likedAuthorRecipes.length > 0)
          user.likedAuthorRecipes.forEach((recipe) => IDs.push(recipe));
      }
    });
    return IDs;
  }

  likedRecipes(isAPIRecipe, userName) {
    // *- Checks if user have any liked recipes in datastructure, if not liked then return false otherwise true.
    let likedRecipesLength;
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName)
            user.likedAPIRecipes.length <= 0
              ? (likedRecipesLength = false)
              : (likedRecipesLength = true);
        })
      : data.users.forEach((user) => {
          if (user.userName === userName)
            user.likedAuthorRecipes.length <= 0
              ? (likedRecipesLength = false)
              : (likedRecipesLength = true);
        });
    return likedRecipesLength;
  }

  likeRecipe(isAPIRecipe, userName, recipe) {
    // *- Validate if recipe is From API or AUTHOR MODEL.
    // *- Then if it's API recipe add recipe into current user which was passed in as argument's dataStructure.
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.push(recipe);
          }
        })
      : data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.push(recipe);
          }
        });
  }

  unlikeRecipe(isAPIRecipe, userName, recID) {
    // *- Find the recipe, either in API or AUTHOR recipes dataStructure.
    // *- Then get the index of the liked recipe using recipeID.
    // *- Then remove recipeID form dataStructure.
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.splice(
              user.likedAPIRecipes.findIndex((recipe) => recipe.id === recID),
              1
            );
          }
        })
      : data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.splice(
              user.likedAuthorRecipes.findIndex(
                (recipe) => recipe.id === recID
              ),
              1
            );
          }
        });
  }
}

const data = {
  users: [],
};
