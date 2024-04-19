"use client";

import { HomeIcon, HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { futura } from "@/app/ui/fonts";

const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Feed", href: "/feed", icon: EyeIcon },
  {
    name: "My favourite doggos",
    href: "/favourites",
    icon: HeartIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-lg font-medium hover:bg-yellow-600 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3 ${futura.className}`,
              {
                "bg-yellow-100 text-yellow-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
