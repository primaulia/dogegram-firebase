"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { futura } from "@/app/ui/fonts";
import { useAuthContext } from "@/context/AuthContext";
import {
  getDoggoPhotosByUserId,
  deleteDoggoPhoto,
} from "@/firebase/firestore/doggos";
import DoggoPhoto from "@/app/components/DoggoPhoto";
import Button from "@/app/components/Button";

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchDoggoPhotos = async () => {
      const { result: doggoPhotoSnapshots } = await getDoggoPhotosByUserId(
        user!.uid
      );
      const savedPhotosData = doggoPhotoSnapshots!.map((doc) => {
        return doc.data().url;
      });
      setSavedPhotos(savedPhotosData);

      return () => {
        setSavedPhotos([]);
      };
    };

    if (user) {
      fetchDoggoPhotos();
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
  };

  return (
    <>
      <div>
        <h2 className={futura.className}>
          {!savedPhotos.length &&
            "You have not liked any doggos yet. Why? Much wow!"}
        </h2>
        <Link href="/feed">
          <Button className="mt-4 w-full">View your feed</Button>
        </Link>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedPhotos.map((photo: string) => (
            <DoggoPhoto
              key={photo}
              photo={photo}
              saved={true}
              handleLike={handleLike}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
