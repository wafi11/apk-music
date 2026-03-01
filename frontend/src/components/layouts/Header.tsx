import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { SearchMusic } from "../ui/SearchMusic";

export const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header
      className={`fixed top-0 left-0 border-b h-20 right-0 z-50 transition-all duration-300 `}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center  justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* <div className="bg-white rounded-full p-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#000">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div> */}
              <span className="text-2xl font-bold text-accent ml-1">
                Waftify
              </span>
            </Link>
          </div>
          <div className="hidden md:block w-full max-w-7xl">
            {/* <SearchMusic /> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center w-fit gap-8">
            <div className="h-8 w-px bg-white/20"></div>
            <Link
              href="#signup"
              className="text-gray-300 hover:text-accent font-semibold transition-colors text-base hover:scale-105"
            >
              Sign up
            </Link>
            <Link
              href="#login"
              className="text-white border-accent border-2 px-6 py-2 hover:bg-accent hover:text-white font-bold hover:scale-105 transition-transform text-base"
            >
              Log in
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:bg-accent p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>


    </header>
  );
};
