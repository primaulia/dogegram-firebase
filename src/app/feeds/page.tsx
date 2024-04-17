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
