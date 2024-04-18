"use client";

import BreedIcon from "@/app/components/BreedIcon";
import { useEffect, useState } from "react";
import { deleteBreed, getBreedsByUserId } from "@/firebase/firestore/breeds";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { saveBreed } from "@/firebase/firestore/breeds";
import Link from "next/link";
import { futura } from "@/app/ui/fonts";

export default function BreedList({
  breeds,
}: {
  breeds: Record<string, string>;
}) {
  const user = useAuthContext();
  const [savedBreeds, setSavedBreeds] = useState<
    { name: string; iconUrl: string }[]
  >([]);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = snapshots!.map((doc) => {
          const breedName = doc.data().name;
          return {
            name: breedName,
            iconUrl: breeds[breedName],
          };
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

    if (savedBreeds.some((b) => b.name === breed)) {
      await deleteBreed(breed, user.uid);
      setSavedBreeds(savedBreeds.filter((b) => b.name !== breed));
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
      setSavedBreeds([
        ...savedBreeds,
        {
          name: breed,
          iconUrl: breeds[breed],
        },
      ]);
    } else {
      console.error(error);
    }
  };

  return (
    <>
      {savedBreeds.length ? (
        <div className="flex justify-center">
          <div className="bg-gray-50 rounded-md p-3 w-3/4 mb-4">
            <h2 className={`${futura.className} text-center`}>
              Your selected doggo breeds
            </h2>
            <ul className="flex justify-center gap-2">
              {savedBreeds.map(({ name, iconUrl }) => (
                <BreedIcon
                  key={name}
                  breed={name}
                  image={iconUrl}
                  selected={true}
                  handleClick={handleIconClick}
                />
              ))}
            </ul>
            <div className="flex justify-center">
              <Link
                href="/feeds"
                className="my-2 bg-yellow-600 text-white md:p-2 md:px-3 rounded-md hover:bg-yellow-500"
              >
                <button>View feed</button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <ul className="grid grid-cols-6 gap-4">
        {Object.entries(breeds).map(([breed, image]) => (
          <BreedIcon
            key={breed}
            breed={breed}
            image={image}
            selected={savedBreeds.some((b) => b.name === breed)}
            handleClick={handleIconClick}
          />
        ))}
      </ul>
    </>
  );
}