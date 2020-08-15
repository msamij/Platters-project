const data = {
  likedAPIRecipes: [],
  likedAuthorRecipes: [],
  mostLikedRecipes: [],
};

const readData = () => {
  const storageData = JSON.parse(localStorage.getItem(`likedRecipes`));
  if (storageData !== null) {
    data.likedAPIRecipes = [...storageData.likedAPIRecipes];
    data.likedAuthorRecipes = [...storageData.likedAuthorRecipes];
    data.mostLikedRecipes = [...storageData.mostLikedRecipes];
  }
};

const saveData = () => {
  localStorage.removeItem(`likedRecipes`);
  localStorage.setItem(`likedRecipes`, JSON.stringify(data));
};

export const likeRecipe = (isAPIRecipe, recipe) => {
  // *- If the recipe object already exists then just increment like count of that recipe.
  if (
    // *- If recipe type is author recipe get the author recipe id with (recipeID) property.
    // *- Else if recipe type is API recipe get the recipe id with (id) property.
    checkRecipeLike(isAPIRecipe, recipe.recipeID ? recipe.recipeID : recipe.id)
  ) {
    isAPIRecipe
      ? data.likedAPIRecipes.forEach((likeObj) => {
          if (likeObj.recipe.id === recipe.id) likeObj.likes += 1;
        })
      : data.likedAuthorRecipes.forEach((likeObj) => {
          if (likeObj.recipe.recipeID === recipe.recipeID) likeObj.likes += 1;
        });
    processMostLikeRecipes();
    saveData();
  }
  // *- Otherwise create a new recipe like object add like and save it in datastructure.
  else {
    const likeObj = {
      recipe,
      likes: 1,
    };
    isAPIRecipe
      ? data.likedAPIRecipes.push(likeObj)
      : data.likedAuthorRecipes.push(likeObj);
    saveData();
  }
};

export const unlikeRecipe = (isAPIRecipe, ID) => {
  readData();
  // *- First validate that the recipe is from API or AUTHOR MODEL.
  // *- Then match the recipe ID with argument ID and remove like count.
  isAPIRecipe
    ? data.likedAPIRecipes.forEach((likeObj) => {
        if (likeObj.recipe.id === ID) {
          // *- If like count is > 0  only then decrement like count.
          if (likeObj.likes > 0) likeObj.likes -= 1;
        }
      })
    : data.likedAuthorRecipes.forEach((likeObj) => {
        if (likeObj.recipe.recipeID === ID) {
          if (likeObj.likes > 0) likeObj.likes -= 1;
        }
      });
  processMostLikeRecipes();
  saveData();
};

export const deleteRecipe = (ID) => {
  readData();
  data.likedAuthorRecipes.forEach((likeObj) => {
    // *- If recipe was found then delete it.
    if (likeObj.recipe.recipeID === ID) {
      data.likedAuthorRecipes.splice(
        data.likedAuthorRecipes.findIndex(
          (likeObj) => likeObj.recipe.recipeID === ID
        ),
        1
      );
    }
  });
  // *- Remove recipe from mostLikedRecipes.
  data.mostLikedRecipes.forEach((likeObj) => {
    if (likeObj.recipe.recipeID === ID) {
      data.mostLikedRecipes.splice(
        data.mostLikedRecipes.findIndex(
          (likeObj) => likeObj.recipe.recipeID === ID
        ),
        1
      );
    }
  });
  saveData();
};

export const isMostLikedRecipes = () => {
  readData();
  return data.mostLikedRecipes;
};

const processMostLikeRecipes = () => {
  // *- Each time recipe is liked or unliked, reset mostLikedRecipes array.
  data.mostLikedRecipes.splice(0);
  // *- Checks if LikedAPIRecipes contains any recipes.
  if (data.likedAPIRecipes.length > 0) {
    data.likedAPIRecipes.forEach((likeObj) => {
      // *- If current like object has more than one like then save the recipe in mostLikedRecipes.
      if (likeObj.likes > 1) data.mostLikedRecipes.push(likeObj);
    });
  }
  // *- Checks if LikedAuthorRecipes contains any recipes.
  if (data.likedAuthorRecipes.length > 0) {
    data.likedAuthorRecipes.forEach((likeObj) => {
      if (likeObj.likes > 1) data.mostLikedRecipes.push(likeObj);
    });
  }
  sortMostLikedRecipes();
};

const sortMostLikedRecipes = () => {
  if (data.mostLikedRecipes.length > 1) {
    for (let i = 0; i < data.mostLikedRecipes.length - 1; i++) {
      for (let index = 0; index < data.mostLikedRecipes.length - 1; index++) {
        // *- If like object at index 0 has 3 likes, and like object at index 1 has 4 likes.
        // *- Then sort the array in desending order.
        if (
          data.mostLikedRecipes[index].likes <
          data.mostLikedRecipes[index + 1].likes
        ) {
          let temp = data.mostLikedRecipes[index];
          data.mostLikedRecipes[index] = data.mostLikedRecipes[index + 1];
          data.mostLikedRecipes[index + 1] = temp;
        }
      }
    }
  }
  saveData();
};

const checkRecipeLike = (isAPIRecipe, ID) => {
  readData();
  // *- To check if a recipe like obj is already in datastructure.
  // *- First validate API or API or AUTHOR recipe type.
  // *- Then match the recipe ID with ID that was passed in as an argument.
  // *- If ID is found in datastructure that means that object is already in datastructure.
  // *- In this case, we just need to add like count to the recipe object.
  // *- If ID is not found in datastructure then simply create new recipe like object and add it to datastructure.
  let isID = false;
  isAPIRecipe
    ? data.likedAPIRecipes.forEach((likeObj) => {
        if (likeObj.recipe.id === ID) isID = true;
      })
    : data.likedAuthorRecipes.forEach((likeObj) => {
        if (likeObj.recipe.recipeID === ID) isID = true;
      });
  return isID;
};
