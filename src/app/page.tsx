import BreedList from "@/app/components/BreedList";
import { fetchHomePage } from "@/lib/data";
import { futura } from "@/app/ui/fonts";

export default async function Page() {
  const breeds = await fetchHomePage();

  return (
    <>
      <h2 className={`${futura.className} my-3 text-center`}>
        💖 Choose your top 3 doggo breeds 💖
      </h2>
      <div className="flex justify-center">
        <p className="bg-gray-50 rounded-md p-3 w-1/2 mb-4">
          Once you&apos;ve picked your top three doggo breeds. We will then feed
          you with our curated pawsome photos especially for you. 🐾
        </p>
      </div>
      <BreedList breeds={breeds} />
    </>
  );
}
