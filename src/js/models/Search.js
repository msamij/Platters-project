import { apiKey } from "../views/base";
import axios from "axios";

export const getSearchRecipes = async (query) => {
  try {
    const response = await axios(
      `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${query}`
    );
    return response.data.results;
  } catch (error) {
    return false;
  }
};
