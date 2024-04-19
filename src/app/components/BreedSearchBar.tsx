import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function BreedSearchBar({
  handleSearch,
}: {
  handleSearch: (term: string) => void;
}) {
  return (
    <div className="relative my-2">
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        id="search"
        type="text"
        name="search"
        placeholder="Search your breeds here"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
