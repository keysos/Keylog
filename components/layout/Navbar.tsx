import Link from "next/link";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  return (
    <div className="flex justify-end py-2 px-2 w-full">
      <nav className="flex items-center gap-4">
        <Link href="/games">Games</Link>
        <Link className="hidden sm:flex" href="/login">
          Log In
        </Link>
        <Link className="hidden sm:flex" href="/signup">
          Register
        </Link>
        <NavbarMenu />
      </nav>
    </div>
  );
};

export default Navbar;
