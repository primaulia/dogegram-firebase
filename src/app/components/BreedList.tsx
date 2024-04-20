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
import { TBreed } from "@/lib/definitions";
import { BreedStore } from "@/firebase/firestore/definitions";

export default function BreedList({ breeds }: { breeds: TBreed[] }) {
  const { user } = useAuthContext();
  const router = useRouter();

  const [savedBreeds, setSavedBreeds] = useState<TBreed[]>([]);
  const [breedsList, setBreedsList] = useState<TBreed[]>(breeds);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData: TBreed[] = snapshots!.map((doc) => {
          const { name, iconUrl, type } = doc.data();

          return {
            name,
            iconUrl,
            type,
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

  const handleIconClick = async (breed: TBreed) => {
    if (!user) {
      console.error("User hasn't logged in yet");
      router.push("/login");
      return;
    }

    if (savedBreeds.some((b) => b.name === breed.name)) {
      await deleteBreed(breed.name, user.uid);
      setSavedBreeds(savedBreeds.filter((b) => b.name !== breed.name));
      return;
    }

    if (savedBreeds.length >= 3) {
      console.error("Maximum amount of breeds chosen, cannot add more breed");
      return false;
    }

    const savedBreedData: BreedStore = {
      name: breed.name,
      iconUrl: breed.iconUrl,
      type: breed.type,
      user_id: user!.uid,
    };

    if (breed.type === "sub") {
      savedBreedData.parent = breeds.find((b) => b.name === breed.name)!.parent;
    }

    const { error } = await saveBreed(savedBreedData);

    if (!error) {
      setSavedBreeds([
        ...savedBreeds,
        {
          name: breed.name,
          iconUrl: breed.iconUrl,
          type: breed.type,
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
        <div className="bg-gray-50 rounded-md p-2 md:p-3 w-full md:w-3/4 md:mb-4">
          <h2 className={`${futura.className} md:text-center my-2`}>
            {savedBreeds.length
              ? "Your selected doggo breeds"
              : "Pick your top 3 doggo breeds 💖"}
          </h2>
          {savedBreeds.length ? (
            <>
              <ul className="flex justify-start md:justify-center flex-wrap gap-1 md:gap-2">
                {savedBreeds.map((breed) => (
                  <BreedIcon
                    key={breed.name}
                    breed={breed}
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
                <Button className="mt-4 w-full">View your feed</Button>
              </Link>
            </>
          ) : (
            <div className="flex justify-center">
              <p className="bg-gray-50 rounded-md md:p-3 md:max-w-[600px] mb-2 md:mb-4">
                Once you&apos;ve made your choice, you will see a list of
                pawesome photos curated especially for you. 🐾
              </p>
            </div>
          )}
        </div>
      </div>
      <BreedSearchBar handleSearch={handleSearch} />
      {breedsList.length ? (
        <ul className="flex flex-wrap justify-center gap-1 md:gap-3">
          {breedsList.map((breed) => (
            <BreedIcon
              key={breed.id}
              breed={breed}
              selected={savedBreeds.some(
                (savedBreed) => savedBreed.name === breed.name
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
