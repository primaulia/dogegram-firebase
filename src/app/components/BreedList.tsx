"use client";

import BreedIcon from "@/app/components/BreedIcon";
import { useEffect, useState } from "react";
import { deleteBreed, getBreedsByUserId } from "@/firebase/firestore/breeds";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { saveBreed } from "@/firebase/firestore/breeds";
import Link from "next/link";
import { futura } from "@/app/ui/fonts";
import Button from "@/app/components/Button";
import { useDebouncedCallback } from "use-debounce";

function hasKeyword(longString: string, keyword: string) {
  const regex = new RegExp(keyword, "i"); // Case-insensitive search
  return regex.test(longString);
}

export default function BreedList({
  breeds,
}: {
  breeds: { name: string; iconUrl: string }[];
}) {
  const user = useAuthContext();
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
          <h2 className={`${futura.className} text-center mb-2`}>
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
      <div className="relative my-2">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id="search"
          type="text"
          name="search"
          placeholder="Search your breeds here"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      <ul className="grid grid-cols-6 gap-4">
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
    </>
  );
}
