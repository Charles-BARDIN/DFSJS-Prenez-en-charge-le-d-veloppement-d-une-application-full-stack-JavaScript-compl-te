import Link from "next/link";
import Image from "next/image";

/** Logo MDD (nuage violet). Dimensions source 695x401 ; la hauteur est pilotée en CSS. */
export const Logo = ({
  href = "/",
  className = "h-9",
}: {
  href?: string;
  className?: string;
}) => {
  return (
    <Link href={href} aria-label="MDD — Accueil" className="inline-flex">
      <Image
        src="/logo.png"
        alt="MDD"
        width={695}
        height={401}
        priority
        className={`${className} w-auto`}
      />
    </Link>
  );
};
