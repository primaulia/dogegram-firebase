import Button from "@/app/components/Button";
import { futura } from "@/app/ui/fonts";

export default function BreedEmptyBanner({
  handleSurpriseClick,
}: {
  handleSurpriseClick: () => void;
}) {
  return (
    <div className="bg-gray-50 rounded-md p-2 md:p-3 w-full md:w-3/4 md:mb-4">
      <h2 className={`${futura.className} md:text-center my-2`}>
        Pick your top 3 doggo breeds 💖
      </h2>
      <div>
        <div className="flex justify-center">
          <p className="bg-gray-50 rounded-md md:p-3 md:max-w-[600px] mb-2 md:mb-4">
            Once you&apos;ve made your choice, you will see a list of pawesome
            photos curated especially for you. 🐾
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
    </div>
  );
}
