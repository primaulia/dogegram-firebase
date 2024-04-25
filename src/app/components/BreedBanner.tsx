import { futura } from "@/app/ui/fonts";
import { TBreed } from "@/lib/definitions";
import BreedIcon from "@/app/components/BreedIcon";
import Link from "next/link";
import Button from "@/app/components/Button";
import clsx from "clsx";

export default function BreedBanner({
  savedBreeds,
  handleSavedIconClick,
  handleSurpriseClick,
}: {
  savedBreeds: TBreed[];
  handleSavedIconClick: (breed: TBreed) => void;
  handleSurpriseClick: () => void;
}) {
  return (
    <div className="bg-gray-50 rounded-md p-2 md:p-3 w-full md:w-3/4 md:mb-4">
      <h2 className={`${futura.className} md:text-center my-2`}>
        Your selected doggo breeds
      </h2>
      <div>
        <ul className="flex justify-start md:justify-center flex-wrap gap-1 md:gap-2">
          {savedBreeds.map((breed) => (
            <BreedIcon
              key={breed.id}
              breed={breed}
              selected={true}
              blurred={false}
              handleClick={handleSavedIconClick}
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
      </div>
    </div>
  );
}
