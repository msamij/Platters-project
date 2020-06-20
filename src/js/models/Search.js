import { apiKey } from "../views/base";
import axios from "axios";

export class Search {
  static async getSearchRecipes(query) {
    try {
      const response = await axios(
        `https://cors-anywhere.herokuapp.com/https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${query}`
      );
      return response.data.results;
    } catch (error) {
      alert(error);
    }
  }
}

// const getDataBySearch = async (api_key, recipe) => {
//     const response = await fetch(
//       `https://cors-anywhere.herokuapp.com/https://api.spoonacular.com/recipes/search?apiKey=${api_key}&query=${recipe}`
//     );
//     const data = await response.json();
//     console.log(data.results);
//   };
//   getDataBySearch("566c523054244b38a477795508ded7be", "burgers");

//   const getSpooncularData = async (api_key, id) => {
//     const response = await fetch(
//       `https://cors-anywhere.herokuapp.com/https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`
//     );
//     const data = await response.json();
//     console.log(data);
//   };
//   getSpooncularData("566c523054244b38a477795508ded7be", 246009);

// 566c523054244b38a477795508ded7be
// Getting image.
// https://spoonacular.com/recipeImages/492560-636x393.jpg
