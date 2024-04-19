import { httpGet } from "./utils";
import { BreedsResponse, ImageResponse, ImagesResponse } from "./definitions";

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

export async function fetchRandomImagesByBreed(
  breed: string
): Promise<string[]> {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/images`;
    const { message } = await httpGet<ImagesResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch image data.");
  }
}

export async function fetchHomePage() {
  const rawAllBreeds = await fetchBreeds();
  const homepageResponse: { name: string; iconUrl: string }[] = [];

  for (const breed in rawAllBreeds) {
    const imageUrl = await fetchRandomImageByBreed(breed); // Call function to get image
    homepageResponse.push({
      name: breed,
      iconUrl: imageUrl,
    });
  }

  return homepageResponse;
}
