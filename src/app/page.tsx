import SideNav from "@/app/components/sidenav";
import { fetchBreeds } from "@/lib/data";

export default async function Page() {
  const allBreeds = (await fetchBreeds()).message;

  return (
    <main className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <ul>
          {Object.keys(allBreeds).map((breed) => (
            <li key={breed}>{breed}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
