import SideNav from "@/app/components/sidenav";
import Image from "next/image";
import { fetchHomePage } from "@/lib/data";
import { rgbDataURL } from "@/lib/utils";
import { futura } from "@/app/ui/fonts";
import { CSSProperties } from "react-css-modules";

export default async function Page() {
  const homepageData = await fetchHomePage();
  const imageStyle: CSSProperties = {
    borderRadius: "50%",
    border: "1px solid #fff",
    objectFit: "cover",
    zIndex: -1,
    filter: "blur(1px)",
  };

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
            Once you've picked your top three doggo breeds. We will then feed
            you with our curated pawsome photos especially for you. 🐾
          </p>
        </div>
        <ul className="grid grid-cols-7 gap-4">
          {Object.entries(homepageData).map((entry) => {
            return (
              <li
                className="relative w-[160px] h-[160px] flex justify-center items-center cursor-pointer"
                key={entry[0]}
              >
                <h3
                  className={`${futura.className} text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]`}
                >
                  {entry[0]}
                </h3>
                <Image
                  src={entry[1]}
                  sizes="160px"
                  fill
                  alt={entry[0]}
                  placeholder="blur"
                  blurDataURL={rgbDataURL(237, 181, 6)}
                  style={imageStyle}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
