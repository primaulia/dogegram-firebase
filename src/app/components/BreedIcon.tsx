"use client";

import { futura } from "@/app/ui/fonts";

export default function BreedIcon({
  image,
  breed,
  selected,
  handleClick,
}: {
  image: string;
  breed: string;
  selected: boolean;
  handleClick: (breed: string) => void;
}) {
  return (
    <li
      className="relative w-[160px] h-[160px] flex justify-center items-center cursor-pointer rounded-full bg-cover"
      style={{ backgroundImage: `url(${image})` }}
      key={breed}
      onClick={() => handleClick(breed)}
    >
      <div className="backdrop-blur-[1.5px] w-full h-full absolute hover:backdrop-blur-none"></div>
      <h3
        className={`${futura.className} text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
      >
        {selected ? "X" : breed}
      </h3>
    </li>
  );
}
