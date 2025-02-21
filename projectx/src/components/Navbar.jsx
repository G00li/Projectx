import Link from "next/link"
import { NAV_LINKS } from "@/constants"
import Image from "next/image"



const Navbar = () => {
  return(
    <nav className="flex justify-between items-center max-container padding-container relative z-30 py-3 px-5 border-b border-gray-700">
      <Link href="/">
        <Image src="logo/logo-gray.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="hidden h-full gap-12 lg:flex items-center">
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.key} className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold">
            {link.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;