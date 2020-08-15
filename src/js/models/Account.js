const data = {
  users: [],
  authors: [],
};

export const readData = () => {
  const storageData = JSON.parse(localStorage.getItem(`accountData`));
  if (storageData !== null) {
    data.users = [...storageData.users];
    data.authors = [...storageData.authors];
  }
};

const saveData = () => {
  localStorage.removeItem(`accountData`);
  localStorage.setItem(`accountData`, JSON.stringify(data));
  console.log(JSON.parse(localStorage.getItem(`accountData`)));
};

export const verifyAccount = (isUser, userName, password) => {
  readData();
  let isAccount = false;
  isUser
    ? data.users.forEach((user) => {
        if (user.userName === userName && user.password === password)
          isAccount = user;
      })
    : data.authors.forEach((author) => {
        if (author.userName === userName && author.password === password)
          isAccount = author;
      });
  return isAccount;
};

export const isUserName = (isUser, userName) => {
  readData();
  let isUserName = false;
  isUser
    ? data.users.forEach((user) => {
        if (user.userName === userName) isUserName = user.userName;
      })
    : data.authors.forEach((author) => {
        if (author.userName === userName) isUserName = author.userName;
      });
  return isUserName;
};

export const isLoggedIn = () => {
  const account = JSON.parse(localStorage.getItem(`loggedInAccount`));
  if (account !== null) return account;
};

export const signup = (isUser, obj) => {
  isUser ? data.users.push(obj) : data.authors.push(obj);
  saveData();
};

export const login = (obj) => {
  localStorage.setItem(`loggedInAccount`, JSON.stringify(obj));
  console.log(JSON.parse(localStorage.getItem(`loggedInAccount`)));
};

export const logOut = () => {
  localStorage.removeItem(`loggedInAccount`);
};

// *- Save author recipes in author Object
export const saveRecipe = (authorID, recipeID) => {
  readData();
  data.authors.forEach((authorObj) => {
    // *- Find author using ID and save recipe.
    if (authorObj.authorID === authorID) authorObj.recipes.push(recipeID);
  });
  saveData();
};

export const deleteRecipe = (recipeID) => {
  readData();
  // *- Delete recipe from all authors recipes[] array.
  data.authors.forEach((author) => {
    author.recipes.forEach((recID) => {
      // *- If recipe was found then delete it.
      if (recID === recipeID) {
        author.recipes.splice(
          author.recipes.findIndex((recID) => recID === recipeID),
          1
        );
      }
    });
  });

  // *- Delete recipe from user likedAuthorRecipes [] array.
  data.users.forEach((user) => {
    user.likedAuthorRecipes.forEach((recipe) => {
      // *- If recipe was found then delete it.
      if (recipe.recipeID === recipeID) {
        user.likedAuthorRecipes.splice(
          user.likedAuthorRecipes.findIndex((rec) => rec.recipeID === recipeID),
          1
        );
      }
    });
  });

  // *- Delete recipe from author likedAuthorRecipes [] array.
  data.authors.forEach((author) => {
    author.likedAuthorRecipes.forEach((recipe) => {
      // *- If recipe was found then delete it.
      if (recipe.recipeID === recipeID) {
        author.likedAuthorRecipes.splice(
          author.likedAuthorRecipes.findIndex(
            (rec) => rec.recipeID === recipeID
          ),
          1
        );
      }
    });
  });
  saveData();
};

export const isRecipeLiked = (isUser, isAPIRecipe, userName, ID) => {
  readData();
  // *- Validate recipe type that recipe is from API or from AUTHOR MODEL.
  // *- Then validate that user with the userName has already liked the recipe.
  // *- If recipe is liked, then return true otherwise return false.
  let isRecipeLiked = false;
  // *- If it's user account Checks in users dataStructure, otherwise in author dataStructure.
  if (isUser) {
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
              if (recipe.recipeID === ID) isRecipeLiked = true;
            });
          }
        });
  }
  // *- Checks in authors dataStructure.
  else {
    isAPIRecipe
      ? data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAPIRecipes.forEach((recipe) => {
              if (recipe.id === ID) isRecipeLiked = true;
            });
          }
        })
      : data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAuthorRecipes.forEach((recipe) => {
              if (recipe.recipeID === ID) isRecipeLiked = true;
            });
          }
        });
  }
  return isRecipeLiked;
};

export const getLikedRecipes = (isUser, userName) => {
  let recipes = [];
  readData();
  isUser
    ? data.users.forEach((user) => {
        if (user.userName === userName) {
          // *- Get liked API Recipes.
          if (user.likedAPIRecipes.length > 0)
            user.likedAPIRecipes.forEach((recipe) => recipes.push(recipe));
          // *- Get liked Author Recipes.
          if (user.likedAuthorRecipes.length > 0)
            user.likedAuthorRecipes.forEach((recipe) => recipes.push(recipe));
        }
      })
    : data.authors.forEach((author) => {
        if (author.userName === userName) {
          // *- Get liked API Recipes.
          if (author.likedAPIRecipes.length > 0)
            author.likedAPIRecipes.forEach((recipe) => recipes.push(recipe));
          // *- Get liked Author Recipes.
          if (author.likedAuthorRecipes.length > 0)
            author.likedAuthorRecipes.forEach((recipe) => recipes.push(recipe));
        }
      });
  return recipes;
};

export const likeRecipe = (isUser, isAPIRecipe, userName, recipe) => {
  // *- If account type is of user.
  if (isUser) {
    // *- If recipe type is of API.
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.push(recipe);
          }
        })
      : // *- If recipe is from author |MODEL|.
        data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.push(recipe);
          }
        });
  }
  // *- If account type is of author.
  else {
    // *- If recipe type is of API.
    isAPIRecipe
      ? data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAPIRecipes.push(recipe);
          }
        })
      : // *- If recipe is from author |MODEL|.
        data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAuthorRecipes.push(recipe);
          }
        });
  }
  saveData();
};

export const unlikeRecipe = (isUser, isAPIRecipe, userName, recID) => {
  // *- Find the recipe, either in API or AUTHOR recipes dataStructure.
  // *- Then get the index of the liked recipe using recipeID.
  // *- Then remove recipe form dataStructure.
  // *- If account type is of user.
  if (isUser) {
    // *- If recipe type is of API.
    isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.splice(
              user.likedAPIRecipes.findIndex((recipe) => recipe.id === recID),
              1
            );
          }
        })
      : // *- If recipe type is of author recipe.
        data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.splice(
              user.likedAuthorRecipes.findIndex(
                (recipe) => recipe.recipeID === recID
              ),
              1
            );
          }
        });
  }
  // *- If account type is of author.
  else {
    // *- If recipe type is of API.
    isAPIRecipe
      ? data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAPIRecipes.splice(
              author.likedAPIRecipes.findIndex((recipe) => recipe.id === recID),
              1
            );
          }
        })
      : // *- If recipe type is of author model recipe.
        data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAuthorRecipes.splice(
              author.likedAuthorRecipes.findIndex(
                (recipe) => recipe.recipeID === recID
              ),
              1
            );
          }
        });
  }
  saveData();
};
