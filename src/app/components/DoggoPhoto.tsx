import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HearthSolidIcon } from "@heroicons/react/24/solid";

export default function DoggoPhoto({
  photo,
  saved,
  handleLike,
}: {
  photo: string;
  saved: boolean;
  handleLike: (photoUrl: string) => void;
}) {
  return (
    <li
      key={photo}
      className="relative w-full h-[480px] bg-cover bg-center my-2 rounded-md cursor-pointer text-center"
      style={{ backgroundImage: `url(${photo})` }}
      onClick={() => handleLike(photo)}
    >
      {saved ? (
        <HearthSolidIcon className="w-16 absolute right-2 top-2 text-yellow-300 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" />
      ) : (
        <HeartIcon className="w-16 absolute right-2 top-2 text-yellow-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" />
      )}
    </li>
  );
}
