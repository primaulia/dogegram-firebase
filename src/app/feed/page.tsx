"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { shuffle } from "@/lib/utils";
import { futura } from "@/app/ui/fonts";
import { fetchRandomImagesByBreed } from "@/lib/data";
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
        const { result: breedsSnapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = breedsSnapshots!.map((doc) => {
          return doc.data().name;
        });

        const { result: doggoPhotoSnapshots } = await getDoggoPhotosByUserId(
          user!.uid
        );
        const savedPhotosData = doggoPhotoSnapshots!.map((doc) => {
          return doc.data().url;
        });
        setSavedPhotos([...savedPhotos, ...savedPhotosData]);

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
        {doggoPhotos.length
          ? "Choose your favourite doggo by clicking the 💖 button."
          : "⚠️ You have not chosen any doggo breed yet. Choose one to view your doggo feeds!"}
      </h2>
      {doggoPhotos.length ? (
        <ul className="grid grid-cols-2 gap-3">
          {doggoPhotos.map((photo) => (
            <DoggoPhoto
              key={photo}
              photo={photo}
              saved={savedPhotos.includes(photo)}
              handleLike={handleLike}
            />
          ))}
        </ul>
      ) : (
        <Link href="/">
          <Button className="mt-4 w-full">Choose your favourite breed</Button>
        </Link>
      )}
    </>
  );
}
