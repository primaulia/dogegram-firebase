import { futura } from "@/app/ui/fonts";

export default function Breed({
  image,
  breed,
}: {
  image: string;
  breed: string;
}) {
  return (
    <li
      className="relative w-[160px] h-[160px] flex justify-center items-center cursor-pointer rounded-full bg-cover"
      style={{ backgroundImage: `url(${image})` }}
      key={breed}
    >
      <div className="backdrop-blur-[1.5px] w-full h-full absolute hover:backdrop-blur-none"></div>
      <h3
        className={`${futura.className} text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
      >
        {breed}
      </h3>
    </li>
  );
}
