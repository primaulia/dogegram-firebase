"use client";

import { getBreedsByUserId } from "@/firebase/firestore/breeds";
import { saveDoggoPhoto } from "@/firebase/firestore/doggo";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { fetchRandomImagesByBreed } from "@/lib/data";
import { shuffle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HearthSolidIcon } from "@heroicons/react/24/solid";

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  className="w-6 h-6"
>
  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
</svg>;

export default function Page() {
  const user = useAuthContext();
  const router = useRouter();

  const [doggoPhotos, setDoggoPhotos] = useState<string[]>([]);
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

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
  }, [user, router]);

  const handleLike = async (photoUrl: string) => {
    const { error } = await saveDoggoPhoto({
      photoUrl,
      user_id: user!.uid,
    });

    if (!error) {
      console.log("saved");

      setSavedPhotos([...savedPhotos, photoUrl]);
    } else {
      console.error(error);
    }
  };

  return (
    <>
      {user ? (
        <ul className="grid grid-cols-2 gap-3">
          {doggoPhotos.map((photo) => (
            <li
              key={photo}
              className="relative w-full h-[480px] bg-cover bg-center my-2 rounded-md cursor-pointer text-center"
              style={{ backgroundImage: `url(${photo})` }}
              onClick={() => handleLike(photo)}
            >
              {savedPhotos.includes(photo) ? (
                <HearthSolidIcon className="w-8 absolute right-2 top-2" />
              ) : (
                <HeartIcon className="w-8 absolute right-2 top-2" />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <h1>Login first</h1>
      )}
    </>
  );
}
