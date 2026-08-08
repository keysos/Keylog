import Link from "next/link";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  return (
    <div className="flex justify-end py-2 px-2 w-full">
      <nav className="flex items-center gap-2">
        <Link href="/games">Games</Link>
        <NavbarMenu />
      </nav>
    </div>
  );
};

export default Navbar;
