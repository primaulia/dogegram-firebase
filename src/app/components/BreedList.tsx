"use client";

import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import BreedBanner from "@/app/components/BreedBanner";
import BreedEmptyBanner from "@/app/components/BreedEmptyBanner";
import BreedIcon from "@/app/components/BreedIcon";
import BreedSearchBar from "@/app/components/BreedSearchBar";
import Notification from "@/app/components/Notification";
import {
  deleteBreedById,
  deleteBreedByName,
  getBreedsByUserId,
} from "@/firebase/firestore/breeds";
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
          const id = doc.id;
          const { name, iconUrl, type, parent } = doc.data();

          const breedStored: TBreed = {
            id,
            name,
            iconUrl,
            type,
          };

          if (parent) {
            breedStored.parent = parent;
          }

          return breedStored;
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

  const removeBreedById = async (breedId: string, userId: string) => {
    await deleteBreedById(breedId, userId);
    setSavedBreeds(savedBreeds.filter((b) => b.id != breedId));
  };

  const removeBreedByName = async (breed: TBreed, userId: string) => {
    await deleteBreedByName(breed, userId);
    setSavedBreeds(
      savedBreeds.filter((b) =>
        breed.type === "sub"
          ? b.name !== breed.name && b.parent !== breed.parent
          : b.name !== breed.name
      )
    );
  };

  const storeBreed = async (breed: TBreed) => {
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

    if (result) {
      const { user_id, ...rest } = savedBreedData;

      return {
        id: result.id, // store the default id from firestore in state
        ...rest,
      };
    } else {
      console.error(error);
      return;
    }
  };

  const prepareBreedForState = (storedBreed: TBreed | undefined) => {
    const breedStored: TBreed = {
      id: storedBreed!.id,
      name: storedBreed!.name,
      iconUrl: storedBreed!.iconUrl,
      type: storedBreed!.type,
    };
    if (storedBreed?.parent) {
      breedStored.parent = storedBreed?.parent;
    }

    return breedStored;
  };

  const showMaxBreedNotif = () => {
    console.error("Maximum amount of breeds chosen, cannot add more breed");
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleSavedIconClick = async (breed: TBreed) => {
    if (!user) {
      console.error("User hasn't logged in yet");
      router.push("/login");
      return;
    }

    if (savedBreeds.some((b) => b.id === breed.id)) {
      removeBreedById(breed.id, user.uid);
      return;
    }

    if (savedBreeds.length === 3) {
      showMaxBreedNotif();
      return;
    }

    const storedBreed = await storeBreed(breed);
    const breedStored: TBreed = prepareBreedForState(storedBreed);

    if (breedStored) {
      setSavedBreeds([...savedBreeds, breedStored]);
    }
  };

  const handleIconClick = async (breed: TBreed) => {
    if (!user) {
      console.error("User hasn't logged in yet");
      router.push("/login");
      return;
    }

    if (
      savedBreeds.some((b) =>
        breed.type === "sub"
          ? b.name === breed.name && b.parent === breed.parent
          : b.name === breed.name
      )
    ) {
      removeBreedByName(breed, user.uid);
      return;
    }

    if (savedBreeds.length === 3) {
      showMaxBreedNotif();
      return false;
    }

    const storedBreed = await storeBreed(breed);
    const breedStored: TBreed = prepareBreedForState(storedBreed);

    if (breedStored) {
      setSavedBreeds([...savedBreeds, breedStored]);
    }
  };

  const handleSurpriseClick = async () => {
    // Shuffle array
    const shuffled = [...breeds].sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    let randomBreeds = shuffled.slice(0, 3 - savedBreeds.length);

    const newSavedBreeds = await Promise.all(
      randomBreeds.map(async (breed) => {
        const storedBreed = await storeBreed(breed);
        return prepareBreedForState(storedBreed);
      })
    );

    if (newSavedBreeds) {
      setSavedBreeds([...savedBreeds, ...newSavedBreeds]);
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    if (term) {
      setBreedsList(breeds.filter((breed) => hasKeyword(breed.name, term)));
    } else {
      setBreedsList(breeds);
    }
  }, 300);

  return (
    <>
      <div className="flex justify-center relative">
        <Notification shown={showNotification}>
          <h3 className={futura.className}>
            You can only choose 3 breeds at max. Please remove one if you wish
            to choose a different breed 🙏
          </h3>
        </Notification>
        {savedBreeds.length ? (
          <BreedBanner
            savedBreeds={savedBreeds}
            handleSavedIconClick={handleSavedIconClick}
            handleSurpriseClick={handleSurpriseClick}
          />
        ) : (
          <BreedEmptyBanner handleSurpriseClick={handleSurpriseClick} />
        )}
      </div>
      <BreedSearchBar handleSearch={handleSearch} />
      <ul className="flex flex-wrap justify-center gap-1 md:gap-3">
        {breedsList.map((breed) => (
          <BreedIcon
            key={breed.id}
            breed={breed}
            selected={savedBreeds.some((savedBreed) =>
              savedBreed.type === "sub"
                ? savedBreed.parent === breed.parent &&
                  savedBreed.name === breed.name
                : savedBreed.name === breed.name
            )}
            blurred={true}
            handleClick={handleIconClick}
          />
        ))}
      </ul>
      {!breedsList.length && (
        <h2 className={`${futura.className} my-6 text-center`}>
          No breed found with that keyword. Please try again 🙏.
        </h2>
      )}
    </>
  );
}
