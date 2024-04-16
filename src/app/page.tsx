import SideNav from "@/app/components/SideNav";
import Breed from "@/app/components/Breed";
import { fetchHomePage } from "@/lib/data";
import { futura } from "@/app/ui/fonts";

export default async function Page() {
  const homepageData = await fetchHomePage();

  return (
    <main className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <h2 className={`${futura.className} my-3 text-center`}>
          💖 Choose your top 3 doggo breeds 💖
        </h2>
        <div className=" flex justify-center">
          <p className="bg-gray-50 rounded-md p-3 w-1/2 mb-4">
            Once you&apos;ve picked your top three doggo breeds. We will then
            feed you with our curated pawsome photos especially for you. 🐾
          </p>
        </div>
        <ul className="grid grid-cols-7 gap-4">
          {Object.entries(homepageData).map(([breed, image]) => (
            <Breed key={breed} breed={breed} image={image} />
          ))}
        </ul>
      </div>
    </main>
  );
}
