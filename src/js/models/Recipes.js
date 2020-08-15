import { apiKey } from "../views/base";
import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipes() {
    try {
      const response = await axios(
        `https://cors-anywhere.herokuapp.com/https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${apiKey}`
      );
      this.title = response.data.title;
      this.ingredients = response.data.extendedIngredients;
      this.instructions = response.data.instructions;
      this.sourceName = response.data.sourceName;
      this.sourceUrl = response.data.sourceUrl;
    } catch (error) {
      return false;
    }
  }
}
