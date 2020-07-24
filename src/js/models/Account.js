const data = {
  users: [],
  authors: [],
};

export const verifyAccount = (isUser, userName, password) => {
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

export const signup = (isUser, obj) => {
  isUser ? data.users.push(obj) : data.authors.push(obj);
};

export const isRecipeLiked = (isUser, isAPIRecipe, userName, ID) => {
  // *- Validate that recipe is from API or from AUTHOR MODEL.
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
              if (recipe.id === ID) isRecipeLiked = true;
            });
          }
        });
  } else {
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
              if (recipe.id === ID) isRecipeLiked = true;
            });
          }
        });
  }
  return isRecipeLiked;
};

export const getLikedRecipes = (isUser, userName) => {
  let IDs = [];
  isUser
    ? data.users.forEach((user) => {
        if (user.userName === userName) {
          if (user.likedAPIRecipes.length > 0)
            user.likedAPIRecipes.forEach((recipe) => IDs.push(recipe));
          else if (user.likedAuthorRecipes.length > 0)
            user.likedAuthorRecipes.forEach((recipe) => IDs.push(recipe));
        }
      })
    : data.authors.forEach((author) => {
        if (author.userName === userName) {
          if (author.likedAPIRecipes.length > 0)
            author.likedAPIRecipes.forEach((recipe) => IDs.push(recipe));
          else if (author.likedAuthorRecipes.length > 0)
            author.likedAuthorRecipes.forEach((recipe) => IDs.push(recipe));
        }
      });
  return IDs;
};

export const likeRecipe = (isUser, isAPIRecipe, userName, recipe) => {
  // *- Validate if recipe is From API or AUTHOR MODEL.
  // *- Then if it's API recipe add recipe into current user which was passed in as argument's dataStructure.
  isUser
    ? isAPIRecipe
      ? data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAPIRecipes.push(recipe);
          }
        })
      : data.users.forEach((user) => {
          if (user.userName === userName) {
            user.likedAuthorRecipes.push(recipe);
          }
        })
    : isAPIRecipe
    ? data.authors.forEach((author) => {
        if (author.userName === userName) {
          author.likedAPIRecipes.push(recipe);
        }
      })
    : data.authors.forEach((author) => {
        if (author.userName === userName) {
          author.likedAuthorRecipes.push(recipe);
        }
      });
};

export const unlikeRecipe = (isUser, isAPIRecipe, userName, recID) => {
  // *- Find the recipe, either in API or AUTHOR recipes dataStructure.
  // *- Then get the index of the liked recipe using recipeID.
  // *- Then remove recipeID form dataStructure.
  if (isUser) {
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
  } else {
    isAPIRecipe
      ? data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAPIRecipes.splice(
              author.likedAPIRecipes.findIndex((recipe) => recipe.id === recID),
              1
            );
          }
        })
      : data.authors.forEach((author) => {
          if (author.userName === userName) {
            author.likedAuthorRecipes.splice(
              author.likedAuthorRecipes.findIndex(
                (recipe) => recipe.id === recID
              ),
              1
            );
          }
        });
  }
};
