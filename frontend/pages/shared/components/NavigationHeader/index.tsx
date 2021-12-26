import React from "react";
import Link from "next/link";

const NavigationHeader: React.FC = () => {
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" className="flex">
          <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
            BHERO
          </span>
        </a>

        <div className="w-full sm:block md:w-auto" id="mobile-menu">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            <Link href="/finder">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Finder
                </a>
              </li>
            </Link>

            <Link href="/preview">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Preview generator
                </a>
              </li>
            </Link>

            <Link href="/preview-by-seed">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  Preview by Seed
                </a>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationHeader;
