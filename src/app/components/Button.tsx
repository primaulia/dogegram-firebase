import clsx from "clsx";
import { futura } from "@/app/ui/fonts";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        `flex h-10 justify-center items-center rounded-lg bg-yellow-600 px-4 text-lg text-white transition-colors hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 active:bg-yellow-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${futura.className}`,
        className
      )}
    >
      {children}
    </button>
  );
}
