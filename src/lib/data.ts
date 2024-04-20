import { httpGet } from "./utils";
import { v4 as uuidv4 } from "uuid";
import { BreedsResponse, ImageResponse, ImagesResponse } from "./definitions";

async function fetchBreeds() {
  try {
    const url = "https://dog.ceo/api/breeds/list/all";
    const { message } = await httpGet<BreedsResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch breeds data.");
  }
}

async function fetchRandomImageByBreed(breed: string): Promise<string> {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/images/random`;
    const { message } = await httpGet<ImageResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch random image data.");
  }
}

async function fetchRandomImageBySubBreed(
  breed: string,
  subBreed: string
): Promise<string> {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`;
    const { message } = await httpGet<ImageResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch image data.");
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

export async function fetchRandomImagesBySubBreed(
  breed: string,
  subBreed: string
): Promise<string[]> {
  try {
    const url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images`;
    const { message } = await httpGet<ImagesResponse>(url);
    return message;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch image data.");
  }
}

export async function fetchHomePage() {
  const allParentBreeds = await fetchBreeds();

  const homepageResponse: {
    id: string;
    name: string;
    iconUrl: string;
    type: "base" | "sub";
    parent?: string;
  }[] = [];

  for (const breed in allParentBreeds) {
    const imageUrl = await fetchRandomImageByBreed(breed);
    homepageResponse.push({
      id: uuidv4(),
      name: breed,
      iconUrl: imageUrl,
      type: "base",
    });

    if (allParentBreeds[breed]) {
      for (const subBreed of allParentBreeds[breed]) {
        const subBreedImageUrl = await fetchRandomImageBySubBreed(
          breed,
          subBreed
        );

        homepageResponse.push({
          id: uuidv4(),
          name: subBreed,
          iconUrl: subBreedImageUrl,
          type: "sub",
          parent: breed,
        });
      }
    }
  }

  return homepageResponse;
}
