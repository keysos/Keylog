import { FaGithub, FaLinkedin, FaFreeCodeCamp } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="text-muted-foreground bg-card border-border mt-2 border-t text-sm sm:text-base">
      <div className="flex flex-col items-center justify-between gap-4 p-4 sm:mx-4 sm:flex-row">
        {`© ${new Date().getFullYear()} Keylog • v1.0 • Powered by IGDB`}

        <div className="flex gap-3">
          <a href="https://github.com/keysos">
            <FaGithub className="hover:text-foreground size-6 cursor-pointer transition-colors" />
          </a>

          <a href="https://www.linkedin.com/in/gustavo-abreu-39728820a/">
            <FaLinkedin className="hover:text-foreground size-6 cursor-pointer transition-colors" />
          </a>

          <a href="https://www.freecodecamp.org/keysos">
            <FaFreeCodeCamp className="hover:text-foreground size-6 cursor-pointer transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
