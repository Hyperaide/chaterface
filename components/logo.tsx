import Image from "next/image";
import Link from "next/link";

export default function Logo({style = "default", className, color = "black"}: {style?: "small" | "default", className?: string, color?: "black" | "white"}) {

  if (style === "small") {
    return (
      <Link href="/" className={`flex flex-row items-center justify-center ${className}`}>
        <Image src={color === "black" ? "/black-logomark.svg" : "/white-logomark.svg"} alt="Logo" width={24} height={24} />
        <h1 className={`text-sm font-medium text-sage-12`}>Ground 0</h1>
      </Link>
    );
  }

  return (
    <Link href="/" className={`flex flex-row items-center justify-center ${className}`}>
      <Image src={color === "black" ? "/black-logomark.svg" : "/white-logomark.svg"} alt="Logo" width={32} height={32} />
      <h1 className={`text-xl font-medium text-sage-12`}>Ground 0</h1>
    </Link>
  );
}