"use client";

import { futura } from "@/app/ui/fonts";
import clsx from "clsx";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function BreedIcon({
  image,
  breed,
  selected,
  blurred,
  handleClick,
}: {
  image: string;
  breed: string;
  selected: boolean;
  blurred: boolean;
  handleClick: (breed: string) => void;
}) {
  return (
    <li
      className="relative w-[160px] h-[160px] flex justify-center items-center cursor-pointer rounded-full bg-cover"
      style={{ backgroundImage: `url(${image})` }}
      key={breed}
      onClick={() => handleClick(breed)}
    >
      <div
        className={clsx("w-full h-full absolute", {
          "backdrop-blur-[1.5px] hover:backdrop-blur-none": blurred,
        })}
      ></div>
      <h3
        className={`${futura.className} text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
      >
        {breed}
      </h3>
      {selected && (
        <div>
          <XCircleIcon className="absolute top-3 right-2 h-[40px] w-[40px] -translate-y-1/2 text-yellow-600 drop-shadow-[0_1.2px_1.2px_rgba(234, 179, 8,0.8)]" />
        </div>
      )}
    </li>
  );
}
