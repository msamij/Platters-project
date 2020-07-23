export const skeletonRecipes = () =>
  `<div class="recipes-box recipes-box-1">
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
              </div>
              <div
                class="btn-pagination-box btn-pagination-box-4 btn-pagination-box-next"
              ></div>
          </div>`;

export const skeletonRecipeDetails = () =>
  `<div class="recipe-view-container">
    <figure class="recipe-img-box skeleton-dark"></figure>
    <div class="recipe-details-box">
      <div class="recipe-ingredients-box">
        <div class="ingredients skeleton-dark"></div>
      </div>
    </div>
  </div>`;

export const renderRecipes = (recipe, recipeBoxNo) =>
  `<div class="recipes-box recipes-box-${recipeBoxNo}">
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
      </div>
      <div class="btn-pagination-box btn-pagination-box-${recipeBoxNo} btn-pagination-box-next"></div>
    </div>`;

export const renderRecipeDetails = (recipe) =>
  `<figure class="recipe-img-box">
    <img
    src="https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg"
    alt="${recipe.title}"/>
      <div class="recipe-btns-box">
        <button class="btn-default btn-prev-alt btn-close-recipe">
          <i class="fas fa-angle-left"></i>
        </button>
        <button class="btn-default like-btn">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="recipe-title-box">
        <h2 class="recipe-title-main">${recipe.title}</h2>
      </div>
    </figure>
    <div class="recipe-details-box"></div>`;

export const ingredientsMarkup = () =>
  `<div class="ingredients-container">
    <div class="ingredient-title-box">
      <h2 class="recipe-ingredient-title">Ingredients</h2>
    </div>
    <div class="recipe-ingredients-box">
      <div class="btn-ingredient-box ingredient-btn-box-prev"></div>
      <div class="ingredients">
        <ul class="ingredient-list"></ul>
      </div>
      <div class="btn-ingredient-box ingredient-btn-box-next"></div>
    </div>
  </div>`;

export const renderIngredient = (ingredient) =>
  `<li>
    <div>
      <i class="fas fa-check-circle"></i>
    </div>
    <span>${ingredient}</span>
  </li>`;

export const ingredientButtons = (isNext, page) =>
  `<button class="btn-default btn-ingredient btn-${
    isNext === "next" ? "forward" : "prev"
  }-alt" data-goto="${isNext === "next" ? page + 1 : page - 1}">
    <i class="fas fa-angle-${isNext === "next" ? "right" : "left"}"></i>
  </button>`;

export const renderInstructionBtn = (sourceUrl, sourceName) =>
  `<div class="recipe-instruction-btn-box">
    <button class="btn-default recipe-instructions-btn">How to cook</button>
    <p>
      This recipe is designed by
      <a href="${sourceUrl}">${sourceName}</a>
    </p>
  </div>`;

export const renderRecipeInstructions = (instructions) =>
  `<div class="instructions">
    <div class="btn-close-box">
      <button class="btn-default btn-prev-alt btn-close-ingredient">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <span>${instructions}</span>
  </div>`;

export const paginationRecipes = (recipe) =>
  ` <a href="#${recipe.id}" class="recipe">
    <div class="img-box">
      <img
        src="https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg"
        alt="${recipe.title}"
      />
    </div>
    <span class="recipe-title">${recipe.title}</span>
    </a>`;

export const paginationbtn = (isNext, page) =>
  `<button class="btn-default btn-pagination btn-${
    isNext === "next" ? "next" : "prev"
  }" data-goto="${isNext === "next" ? page + 1 : page - 1}">
  <i class="fas fa-angle-${isNext === "next" ? "right" : "left"}"></i>
</button>`;

export const renderAuthorAccountMenu = (accountName) =>
  `<div class="account-box author-account--box">
    <div class="account-username author-account--username">${accountName}</div>
    <div class="account-box--inner box-inner--author">
      <ul class="account-menu author-account--menu">
        <li>
          <div class="account-menu--controls">
            <button class="btn-default logout-btn author-btn--logout">
              Logout
            </button>
            <button class="btn-default view-recipe-btn">View Recipes</button>
          </div>
        </li>
      </ul>
    </div>
  </div>`;

export const renderUserAccountMenu = (accountName) =>
  `<div class="account-box user-account--box">
    <div class="account-username user-account--username">${accountName}</div>
    <div class="account-box--inner box-inner--user">
      <ul class="account-menu user-account--menu">
        <li>
          <div class="account-menu--controls">
            <button class="btn-default logout-btn user-btn--logout">
              Logout
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>`;

export const renderLikedRecipesMenu = () =>
  `<div class="likes-icon">
      <i class="fas fa-heart"></i>
    </div>
    <div class="liked-items">
  </div>`;

export const renderLikedRecipe = (recipe) =>
  `<a href="#${recipe.id}" class="liked-item">
    <div class="liked-item--img">
      <img
        src="https://spoonacular.com/recipeImages/${recipe.id}-636x393.jpg"
        alt="${recipe.title}"
      />
    </div>
    <span>${recipe.title}</span>
  </a>`;
