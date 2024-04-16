import { httpGet } from "./utils";
import { BreedsResponse } from "./definitions";

export async function fetchBreeds() {
  try {
    const url = "https://dog.ceo/api/breeds/list/all";
    return await httpGet<BreedsResponse>(url);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch breeds data.");
  }
}
