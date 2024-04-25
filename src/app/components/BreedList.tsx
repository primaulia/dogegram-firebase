"use client";

import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useAuthContext } from "@/context/AuthContext";
import BreedIcon from "@/app/components/BreedIcon";
import BreedSearchBar from "@/app/components/BreedSearchBar";
import Button from "@/app/components/Button";
import Notification from "@/app/components/Notification";
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
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const fetchSavedBreeds = async () => {
      try {
        const { result: snapshots } = await getBreedsByUserId(user!.uid);
        const savedBreedsData: TBreed[] = snapshots!.map((doc) => {
          const { name, iconUrl, type, parent } = doc.data();

          return {
            name,
            iconUrl,
            type,
            parent,
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

    if (savedBreeds.length === 3) {
      console.error("Maximum amount of breeds chosen, cannot add more breed");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return false;
    }

    const savedBreedData: BreedStore = {
      name: breed.name,
      iconUrl: breed.iconUrl,
      type: breed.type,
      user_id: user!.uid,
    };

    if (breed.type === "sub") {
      savedBreedData.parent = breed.parent;
    }

    const { error } = await saveBreed(savedBreedData);

    if (!error) {
      delete savedBreedData.user_id;
      setSavedBreeds([...savedBreeds, savedBreedData]);
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

  const handleSurpriseClick = async () => {
    // Shuffle array
    const shuffled = [...breedsList].sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    let randomBreeds = shuffled.slice(0, 3 - savedBreeds.length);

    randomBreeds.forEach(async (breed) => {
      const savedBreedData: BreedStore = {
        name: breed.name,
        iconUrl: breed.iconUrl,
        type: breed.type,
        user_id: user!.uid,
      };

      if (breed.type === "sub") {
        savedBreedData.parent = breed.parent;
      }

      const { error, result } = await saveBreed(savedBreedData);

      if (!error) {
        setSavedBreeds((prevSavedBreds) => [
          ...prevSavedBreds,
          {
            name: breed.name,
            iconUrl: breed.iconUrl,
            type: breed.type,
            parent: breed.parent,
          },
        ]);
      } else {
        console.error(error);
      }
    });
  };

  return (
    <>
      <div className="flex justify-center relative">
        <Notification shown={showNotification}>
          <h3 className={futura.className}>
            You can only choose 3 breeds at max. Please remove one if you wish
            to choose a different breed 🙏
          </h3>
        </Notification>

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
              <div className="flex gap-2">
                <Link
                  href="/feed"
                  className={`${savedBreeds.length === 3 ? "w-full" : "w-1/2"}`}
                >
                  <Button className="mt-4 w-full">View your feed</Button>
                </Link>
                <Button
                  className={clsx(
                    `mt-4 ${
                      savedBreeds?.length > 0 && savedBreeds?.length < 3
                        ? "w-1/2"
                        : "hidden"
                    }`
                  )}
                  onClick={handleSurpriseClick}
                  secondary="true"
                >
                  Surprise me
                </Button>
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-center">
                <p className="bg-gray-50 rounded-md md:p-3 md:max-w-[600px] mb-2 md:mb-4">
                  Once you&apos;ve made your choice, you will see a list of
                  pawesome photos curated especially for you. 🐾
                </p>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={handleSurpriseClick}
                secondary="true"
              >
                Surprise me
              </Button>
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
