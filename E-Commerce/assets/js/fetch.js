import { Products } from "./products.js";
const API = "https://fakestoreapi.com/products";

export async function GetAllProducts() {
  try {
    const Responce = await axios.get(API);

    if (!Array.isArray(Response.data)) {
      throw new Error("API format is not an array!");
    }
    return {
      products: Responce.data,
      fromFallback: false,
      error: null,
    };
  } catch (error) {
    console.error("API failed", error);
    return {
      products: Products,
      fromFallback: true,
      error,
    };
  }
}
