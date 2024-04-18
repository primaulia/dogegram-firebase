"use client";

import BreedIcon from "@/app/components/BreedIcon";
import { useEffect, useState } from "react";
import { deleteBreed, getBreedsByUserId } from "@/firebase/firestore/breeds";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { saveBreed } from "@/firebase/firestore/breeds";
import Link from "next/link";
import { futura } from "@/app/ui/fonts";
import Button from "@/app/components/Button";

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
            <h2 className={`${futura.className} text-center mb-2`}>
              Your selected doggo breeds
            </h2>
            <ul className="flex justify-center gap-2">
              {savedBreeds.map(({ name, iconUrl }) => (
                <BreedIcon
                  key={name}
                  breed={name}
                  image={iconUrl}
                  selected={true}
                  blurred={false}
                  handleClick={handleIconClick}
                />
              ))}
            </ul>
            <Link
              href="/feed"
              className="my-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-500 text-sm font-medium"
            >
              <Button className="mt-4 w-full">View feed</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h2 className={`${futura.className} my-3 text-center`}>
            💖 Choose your top 3 doggo breeds 💖
          </h2>
          <div className="flex justify-center">
            <p className="bg-gray-50 rounded-md p-3 w-1/2 mb-4">
              Once you&apos;ve picked your top three doggo breeds. We will then
              feed you with our curated pawsome photos especially for you. 🐾
            </p>
          </div>
        </>
      )}
      <ul className="grid grid-cols-6 gap-4">
        {Object.entries(breeds).map(([breed, image]) => (
          <BreedIcon
            key={breed}
            breed={breed}
            image={image}
            selected={savedBreeds.some((b) => b.name === breed)}
            blurred={true}
            handleClick={handleIconClick}
          />
        ))}
      </ul>
    </>
  );
}
