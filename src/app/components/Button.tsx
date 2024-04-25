import clsx from "clsx";
import { futura } from "@/app/ui/fonts";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  secondary?: string;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  const { secondary } = rest;

  return (
    <button
      {...rest}
      className={clsx(
        `flex h-10 justify-center items-center rounded-lg px-4 text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${futura.className}`,
        {
          "text-white bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 active:bg-yellow-700":
            !secondary,
          "border border-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 active:bg-yellow-700":
            secondary,
        },
        className
      )}
    >
      {children}
    </button>
  );
}
