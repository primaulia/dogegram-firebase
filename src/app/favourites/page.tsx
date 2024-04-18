"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoggoPhotosByUserId } from "@/firebase/firestore/doggos";
import DoggoPhoto from "@/app/components/DoggoPhoto";

export default function Page() {
  const user = useAuthContext();
  const router = useRouter();

  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDoggoPhotos = async () => {
      const { result: doggoPhotoSnapshots } = await getDoggoPhotosByUserId(
        user!.uid
      );
      const savedPhotosData = doggoPhotoSnapshots!.map((doc) => {
        return doc.data().url;
      });
      setSavedPhotos([...savedPhotos, ...savedPhotosData]);
    };

    if (user) {
      fetchDoggoPhotos();
    }
  }, [user, router]);

  return (
    <>
      {user && (
        <ul className="grid grid-cols-2 gap-3">
          {savedPhotos.map((photo: string) => (
            <DoggoPhoto
              key={photo}
              photo={photo}
              saved={true}
              handleLike={() => {}}
            />
          ))}
        </ul>
      )}
    </>
  );
}
