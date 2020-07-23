export const likeRecipe = (isAPIRecipe, recipe) => {
  // *- If the recipe object already exists then just add like to the recipe.
  if (checkRecipeLike(isAPIRecipe, recipe.id)) {
    isAPIRecipe
      ? data.likedAPIRecipes.forEach((likeObj) => {
          if (likeObj.recipe.id === recipe.id) likeObj.likes += 1;
        })
      : data.likedAuthorRecipes.forEach((likeObj) => {
          if (likeObj.recipe.id === recipe.id) likeObj.likes += 1;
        });
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
  }
};

export const unlikeRecipe = (isAPIRecipe, ID) => {
  // *- First validate that the recipe is from API or AUTHOR MODEL.
  // *- Then match the recipe ID with argument ID and remove like count.
  isAPIRecipe
    ? data.likedAPIRecipes.forEach((likeObj) => {
        if (likeObj.recipe.id === ID) {
          // *- If like count is > 0  only then decrement count.
          if (likeObj.likes > 0) likeObj.likes -= 1;
        }
      })
    : data.likedAuthorRecipes.forEach((likeObj) => {
        if (likeObj.recipe.id === ID) {
          if (likeObj.likes > 0) likeObj.likes -= 1;
        }
      });
};

const checkRecipeLike = (isAPIRecipe, ID) => {
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
        if (likeObj.recipe.id === ID) isID = true;
      });
  return isID;
};

const data = {
  likedAPIRecipes: [],
  likedAuthorRecipes: [],
};
