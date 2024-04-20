"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { shuffle } from "@/lib/utils";
import { futura } from "@/app/ui/fonts";
import {
  fetchRandomImagesByBreed,
  fetchRandomImagesBySubBreed,
} from "@/lib/data";
import Button from "@/app/components/Button";
import DoggoPhoto from "@/app/components/DoggoPhoto";
import { useAuthContext } from "@/context/AuthContext";
import { getBreedsByUserId } from "@/firebase/firestore/breeds";
import {
  saveDoggoPhoto,
  getDoggoPhotosByUserId,
  deleteDoggoPhoto,
} from "@/firebase/firestore/doggos";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [doggoPhotos, setDoggoPhotos] = useState<string[]>([]);
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotosByBreeds = async () => {
      try {
        const { result: breedsSnapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = breedsSnapshots!.map((doc) => {
          return {
            name: doc.data().name,
            type: doc.data().type,
            parent: doc.data().parent,
          };
        });

        const { result: doggoPhotoSnapshots } = await getDoggoPhotosByUserId(
          user!.uid
        );
        const savedPhotosData = doggoPhotoSnapshots!.map((doc) => {
          return doc.data().url;
        });
        setSavedPhotos((prevPhotos) => [...prevPhotos, ...savedPhotosData]);

        let photoUrls: string[] = [];

        await Promise.all(
          savedBreedsData.map(async ({ name, type, parent }) => {
            const fetchedPhotos =
              type === "base"
                ? await fetchRandomImagesByBreed(name)
                : await fetchRandomImagesBySubBreed(parent, name);

            photoUrls = [...photoUrls, ...fetchedPhotos];
          })
        );

        setDoggoPhotos(shuffle(photoUrls));
      } catch (error) {
        console.error("Error fetching saved breeds photos:", error);
      }

      return () => {
        setSavedPhotos([]);
        setDoggoPhotos([]);
      };
    };

    if (user) {
      fetchPhotosByBreeds();
    } else {
      router.push("/login");
    }
  }, [user, router]);

  const handleLike = async (photoUrl: string) => {
    if (savedPhotos.includes(photoUrl)) {
      await deleteDoggoPhoto(photoUrl, user!.uid);
      setSavedPhotos(savedPhotos.filter((p) => p !== photoUrl));
      return;
    }

    const { error } = await saveDoggoPhoto({
      url: photoUrl,
      user_id: user!.uid,
    });

    if (!error) {
      setSavedPhotos([...savedPhotos, photoUrl]);
    } else {
      console.error(error);
    }
  };

  return (
    <>
      <h2 className={futura.className}>
        Choose your favourite doggo by clicking the 💖 button.
      </h2>
      <Link href="/">
        <Button className="mt-4 w-full">Change your favourite breeds</Button>
      </Link>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {doggoPhotos.map((photo) => (
          <DoggoPhoto
            key={photo}
            photo={photo}
            saved={savedPhotos.includes(photo)}
            handleLike={handleLike}
          />
        ))}
      </ul>
    </>
  );
}
