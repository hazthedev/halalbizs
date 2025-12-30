import Image from "next/image";

export default function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <Image
      src="/logo.png"
      alt="Halalbizs"
      width={120}
      height={40}
      priority
    />
  );
}
