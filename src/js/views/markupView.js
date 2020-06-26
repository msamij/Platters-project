export const skeletonRecipes = () => {
  const skeletonRecipes = `<div class="recipes-box recipes-box-1">
              <div class="btn-pagination-box btn-pagination-box-1 btn-pagination-box-prev"></div>
              <div class="recipes recipes-1">
                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>
              </div>
              <div
                class="btn-pagination-box btn-pagination-box-1 btn-pagination-box-next"
              ></div>
            </div>

            <div class="recipes-box recipes-box-2">
              <div
                class="btn-pagination-box btn-pagination-box-2 btn-pagination-box-prev"
              ></div>

              <div class="recipes recipes-2">
                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>
              </div>
              <div
                class="btn-pagination-box btn-pagination-box-2 btn-pagination-box-next"
              ></div>
            </div>

            <div class="recipes-box recipes-box-3">
              <div
                class="btn-pagination-box btn-pagination-box-3 btn-pagination-box-prev"
              ></div>

              <div class="recipes recipes-3">
                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>
              </div>
              <div
                class="btn-pagination-box btn-pagination-box-3 btn-pagination-box-next"
              ></div>
            </div>

            <div class="recipes-box recipes-box-4">
              <div
                class="btn-pagination-box btn-pagination-box-4 btn-pagination-box-prev"
              ></div>

              <div class="recipes recipes-4">
                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>

                <a href="#" class="recipe"
                  ><div class="img-box skeleton"></div>
                  <span class="recipe-title skeleton"></span>
                </a>
              </div>
              <div
                class="btn-pagination-box btn-pagination-box-4 btn-pagination-box-next"
              ></div>
          </div>`;
  return skeletonRecipes;
};

export const appLoadRecipes = (recipe, recipeBoxNo) => {
  const appLoadRecipes = `<div class="recipes-box recipes-box-${recipeBoxNo}">
      <div class="btn-pagination-box btn-pagination-box-${recipeBoxNo} btn-pagination-box-prev"></div>

      <div class="recipes recipes-${recipeBoxNo}">
        <a href="#${recipe[0].id}" class="recipe">
          <div class="img-box">
            <img
              src="https://spoonacular.com/recipeImages/${recipe[0].id}-636x393.jpg"
              alt="${recipe[0].title}"
            />
          </div>
          <span class="recipe-title">${recipe[0].title}</span>
        </a>

        <a href="#${recipe[1].id}" class="recipe">
          <div class="img-box">
            <img
              src="https://spoonacular.com/recipeImages/${recipe[1].id}-636x393.jpg"
              alt="${recipe[1].title}"
            />
          </div>
          <span class="recipe-title">${recipe[1].title}</span>
        </a>

        <a href="#${recipe[2].id}" class="recipe">
          <div class="img-box">
            <img
              src="https://spoonacular.com/recipeImages/${recipe[2].id}-636x393.jpg"
              alt="${recipe[2].title}"
            />
          </div>
          <span class="recipe-title">${recipe[2].title}</span>
        </a>
      </div>
      <div class="btn-pagination-box btn-pagination-box-${recipeBoxNo} btn-pagination-box-next"></div>
    </div>`;
  return appLoadRecipes;
};

export const paginationRecipes = (recipe) => {
  const recipeMarkup = ` <a href="#${recipe.id}" class="recipe pizza-recipe">
    <div class="img-box">
      <img
        src="https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg"
        alt="${recipe.title}"
      />
    </div>
    <span class="recipe-title">${recipe.title}</span>
    </a>`;
  return recipeMarkup;
};

export const paginationbtn = (isNext, page) => {
  const btnMarkup = `<button class="btn-default btn-pagination btn-${
    isNext === "next" ? "next" : "prev"
  }" data-goto="${isNext === "next" ? page + 1 : page - 1}">
  <i class="fas fa-angle-${isNext === "next" ? "right" : "left"}"></i>
</button>`;
  return btnMarkup;
};
