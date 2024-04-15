import { Work_Sans as Work } from "next/font/google";
import localFont from "next/font/local";

export const work = Work({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work",
});

export const futura = localFont({
  src: "./futura.woff2",
  display: "swap",
  variable: "--font-futura",
});
