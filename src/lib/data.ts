import { httpGet } from "./utils";
import { BreedsResponse, ImageResponse } from "./definitions";

export async function fetchBreeds() {
  try {
    const url = "https://dog.ceo/api/breeds/list/all";
    const { message } = await httpGet<BreedsResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch breeds data.");
  }
}

export async function fetchRandomImageByBreed(breed: string): Promise<string> {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/images/random`;
    const { message } = await httpGet<ImageResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch random image data.");
  }
}

export async function fetchHomePage() {
  const rawAllBreeds = await fetchBreeds();
  const homepageResponse: Record<string, string> = {};

  for (const breed in rawAllBreeds) {
    const imageUrl = await fetchRandomImageByBreed(breed); // Call function to get image
    homepageResponse[breed] = imageUrl;
  }

  return homepageResponse;
}
