import Link from 'next/link';
import { NAV_LINKS } from '@/constants';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center max-container padding-container relative z-30 py-3 px-5 border-b border-gray-700">
      <Link href="/">
        <Image src="/logo/logo-gray.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="hidden h-full gap-12 lg:flex items-center mr-10">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <Link href={link.href} className="flex items-center gap-2 text-gray-50 cursor-pointer pb-1.5 transition-all hover:font-bold">
              <Image src={link.icon} alt={`${link.label} icon`} width={20} height={20} />
              <span className="hidden sm:block">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
