"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoggoPhotosByUserId } from "@/firebase/firestore/doggos";
import DoggoPhoto from "@/app/components/DoggoPhoto";
import { futura } from "@/app/ui/fonts";
import Link from "next/link";
import Button from "@/app/components/Button";

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
      {!savedPhotos.length && (
        <div>
          <h2 className={futura.className}>
            You have not liked any doggos yet. Why? Much wow!
          </h2>
          <Link href="/feed">
            <Button className="mt-4 w-full">View feed</Button>
          </Link>
        </div>
      )}
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
    </>
  );
}
