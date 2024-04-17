"use client";

import BreedIcon from "@/app/components/BreedIcon";
import { useEffect, useState } from "react";
import { deleteBreed, getBreedsByUserId } from "@/firebase/firestore/breeds";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { saveBreed } from "@/firebase/firestore/breeds";
import Link from "next/link";

export default function BreedList({
  breeds,
}: {
  breeds: Record<string, string>;
}) {
  const user = useAuthContext();
  const [savedBreeds, setSavedBreeds] = useState<string[]>([]);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = snapshots!.map((doc) => {
          return doc.data().name;
        });

        setSavedBreeds(savedBreedsData);
      } catch (error) {
        console.error("Error fetching saved breeds:", error);
      }
    };

    if (user) {
      fetchSavedBreeds();
    }
  }, [user]);

  const router = useRouter();
  const handleIconClick = async (breed: string) => {
    if (!user) {
      console.error("User hasn't logged in yet");
      router.push("/login");
      return;
    }

    if (savedBreeds.includes(breed)) {
      await deleteBreed(breed, user.uid);
      setSavedBreeds(savedBreeds.filter((b) => b !== breed));
      return;
    }

    if (savedBreeds.length >= 3) {
      console.error("Maximum amount of breeds chosen, cannot add more breed");
      return false;
    }

    const { error } = await saveBreed({
      name: breed,
      user_id: user!.uid,
    });

    if (!error) {
      setSavedBreeds([...savedBreeds, breed]);
    } else {
      console.error(error);
    }
  };

  return (
    <>
      {savedBreeds.length ? (
        <div className="flex justify-center">
          <div className="bg-gray-50 rounded-md p-3 w-1/2 mb-4">
            <h2>View feeds</h2>
            <Link href="/feeds">
              <p>View feeds</p>
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}
      <ul className="grid grid-cols-6 gap-4">
        {Object.entries(breeds).map(([breed, image]) => {
          return (
            <>
              <BreedIcon
                key={breed}
                breed={breed}
                image={image}
                selected={savedBreeds.includes(breed)}
                handleClick={handleIconClick}
              />
            </>
          );
        })}
      </ul>
    </>
  );
}
