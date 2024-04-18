import BreedList from "@/app/components/BreedList";
import { fetchHomePage } from "@/lib/data";

export default async function Page() {
  const breeds = await fetchHomePage();
  return <BreedList breeds={breeds} />;
}
