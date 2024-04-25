import clsx from "clsx";

interface NotificationProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shown: boolean;
}

export default function Notification({
  children,
  className,
  shown,
  ...rest
}: NotificationProps) {
  return (
    <div
      className={clsx(
        "absolute right-0 top-0 transition opacity-1 ease-in-out delay-150 bg-yellow-100 duration-300 w-full md:w-1/2 z-10 px-2 py-1 rounded",
        {
          "opacity-0": !shown,
        }
      )}
    >
      {children}
    </div>
  );
}
