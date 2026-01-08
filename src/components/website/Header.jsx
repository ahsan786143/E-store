"use client";

import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
} from "@/app/routes/UserWebsite";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Cart from "./Cart";
import Image from "next/image";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b lg:px-32 px-4">
      <div className="flex justify-between items-center lg:py-5 py-3">
        {/* Logo */}
        <Link href={WEBSITE_HOME}>
          <Image
            src="/assets/images/logo-black.png"
            width={150}
            height={150}
            alt="Logo"
            className="lg:w-32 w-24"
          />
        </Link>

        <div className="flex items-center gap-8">
          {/* Navigation */}
          <nav
            className={`bg-white fixed z-50 top-0 w-full h-screen transition-all duration-300 ease-in-out
              lg:static lg:h-auto lg:w-auto lg:translate-x-0 lg:p-0
              ${isMobileMenuOpen ? "left-0" : "-left-full"}`}
          >
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3">
              <Image
                src="/assets/images/logo-black.png"
                width={120}
                height={120}
                alt="Logo"
                className="lg:w-32 w-24"
              />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoMdClose
                  size={26}
                  className="text-gray-500 hover:text-primary"
                />
              </button>
            </div>

            {/* Menu Items */}
            <ul className="lg:flex items-center gap-6 px-4 lg:px-0 mt-4 lg:mt-0">
              {[
                { label: "Home", href: WEBSITE_HOME },
                { label: "About", href: "#" },
                { label: "Shop", href: "#" },
                { label: "T-shirt", href: "#" },
                { label: "Hoodies", href: "#" },
                { label: "Oversized", href: "#" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="text-gray-600 hover:text-primary hover:font-semibold"
                >
                  <Link
                    href={item.href}
                    className="block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <button type="button">
              <IoIosSearch
                size={24}
                className="text-gray-500 hover:text-primary cursor-pointer"
              />
            </button>

            <Cart />

            {!auth ? (
              <Link href={WEBSITE_LOGIN}>
                <MdOutlineAccountCircle
                  size={24}
                  className="text-gray-500 hover:text-primary cursor-pointer"
                />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar>
                  <AvatarImage
                    src={auth?.avatar?.url || "/assets/images/user.png"}
                  />
                </Avatar>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden block"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FaBars
                size={24}
                className="text-gray-500 hover:text-primary"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
