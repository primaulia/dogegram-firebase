"use client";

import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import BreedIcon from "@/app/components/BreedIcon";
import BreedSearchBar from "@/app/components/BreedSearchBar";
import Button from "@/app/components/Button";
import { deleteBreed, getBreedsByUserId } from "@/firebase/firestore/breeds";
import { saveBreed } from "@/firebase/firestore/breeds";
import { futura } from "@/app/ui/fonts";
import { hasKeyword } from "@/lib/utils";

export default function BreedList({
  breeds,
}: {
  breeds: { name: string; iconUrl: string }[];
}) {
  const user = useAuthContext();
  const router = useRouter();

  const [savedBreeds, setSavedBreeds] = useState<
    { name: string; iconUrl: string }[]
  >([]);
  const [breedsList, setBreedsList] =
    useState<{ name: string; iconUrl: string }[]>(breeds);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData = snapshots!.map((doc) => {
          const breedName = doc.data().name;
          return {
            name: breedName,
            iconUrl: breeds.find((b) => b.name === breedName)!.iconUrl,
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

  const handleIconClick = async (breedName: string) => {
    if (!user) {
      console.error("User hasn't logged in yet");
      router.push("/login");
      return;
    }

    if (savedBreeds.some((b) => b.name === breedName)) {
      await deleteBreed(breedName, user.uid);
      setSavedBreeds(savedBreeds.filter((b) => b.name !== breedName));
      return;
    }

    if (savedBreeds.length >= 3) {
      console.error("Maximum amount of breeds chosen, cannot add more breed");
      return false;
    }

    const { error } = await saveBreed({
      name: breedName,
      user_id: user!.uid,
    });

    if (!error) {
      setSavedBreeds([
        ...savedBreeds,
        {
          name: breedName,
          iconUrl: breeds.find((b) => b.name === breedName)!.iconUrl,
        },
      ]);
    } else {
      console.error(error);
    }
  };
  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setBreedsList(breedsList.filter((breed) => hasKeyword(breed.name, term)));
    } else {
      setBreedsList(breeds);
    }
  }, 300);

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-gray-50 rounded-md p-3 w-3/4 mb-4">
          <h2 className={`${futura.className} text-center my-2`}>
            {savedBreeds.length
              ? "Your selected doggo breeds"
              : "💖 Choose your top 3 doggo breeds 💖"}
          </h2>
          {savedBreeds.length ? (
            <>
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
            </>
          ) : (
            <div className="flex justify-center">
              <p className="bg-gray-50 rounded-md p-3 w-1/2 mb-4">
                Once you&apos;ve picked your choices. You will be able to see
                our curated pawsome photos especially for you. 🐾
              </p>
            </div>
          )}
        </div>
      </div>
      <BreedSearchBar handleSearch={handleSearch} />
      {breedsList.length ? (
        <ul className="flex flex-wrap justify-center gap-3">
          {breedsList.map(({ name, iconUrl }) => (
            <BreedIcon
              key={name}
              breed={name}
              image={iconUrl}
              selected={savedBreeds.some(
                (savedBreed) => savedBreed.name === name
              )}
              blurred={true}
              handleClick={handleIconClick}
            />
          ))}
        </ul>
      ) : (
        <h2 className={`${futura.className} my-6 text-center`}>
          No breed found with that keyword. Please try again 🙏.
        </h2>
      )}
    </>
  );
}
