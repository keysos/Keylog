import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.svg";

const HeroSection = () => {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Image src={logo} alt="Keylog" className="h-auto w-48 sm:w-56" />
        <h2 className="text-muted-foreground text-xl font-medium sm:text-3xl">
          Keep track of what you play
        </h2>
      </div>

      <div className="text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link href="/signup">
          <Button className="w-min text-base">Create a free account</Button>
        </Link>
        <span className="text-sm sm:text-base">
          Or{" "}
          <Link
            href="/login"
            className="text-foreground hover:border-foreground hover:border-b"
          >
            Log in
          </Link>{" "}
          if you already have one
        </span>
      </div>
    </div>
  );
};

export default HeroSection;
