import clsx from "clsx";
import Image from "next/image";

import LogoIcon from "./icons/logo";

export default function LogoSquare({
  size = "sm",
}: {
  size?: "sm" | "medium" | "large";
}) {
  if (size === "sm" || size === "medium") {
    return (
      <div
        className={clsx(
          "flex flex-none items-center justify-center overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
          {
            "h-[40px] w-[80px] rounded-xl": size === "medium",
            "h-[30px] w-[60px] rounded-lg": size === "sm",
          },
        )}
      >
        <Image
          src="/logo.png"
          alt="Halalbizs"
          width={80}
          height={40}
          className={clsx({
            "h-8 w-auto": size === "medium",
            "h-6 w-auto": size === "sm",
          })}
        />
      </div>
    );
  }
  return <LogoIcon />;
}
