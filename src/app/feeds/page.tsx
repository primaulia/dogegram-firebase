"use client";

import { getBreedsByUserId } from "@/firebase/firestore/breeds";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchRandomImagesByBreed } from "@/lib/data";
import { shuffle } from "@/lib/utils";

export default function Page() {
  const user = useAuthContext();
  const [doggoPhotos, setDoggoPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = snapshots!.map((doc) => {
          return doc.data().name;
        });

        let photoUrls: string[] = [];

        await Promise.all(
          savedBreedsData.map(async (breed) => {
            photoUrls = [
              ...photoUrls,
              ...(await fetchRandomImagesByBreed(breed)),
            ];
          })
        );

        photoUrls = shuffle(photoUrls);
        setDoggoPhotos(photoUrls);
      } catch (error) {
        console.error("Error fetching saved breeds photos:", error);
      }
    };

    if (user) {
      fetchSavedBreeds();
    }
  }, [user]);

  return (
    <>
      <ul className="flex flex-col items-center justify-center">
        {doggoPhotos.map((photo) => (
          <li
            key={photo}
            className="relative w-[480px] h-[480px] bg-cover bg-center my-2 rounded-md cursor-pointer"
            style={{ backgroundImage: `url(${photo})` }}
          ></li>
        ))}
      </ul>
    </>
  );
}
