import {
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
} from "@/app/routes/UserWebsite";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiYoutubeLine } from "react-icons/ri";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray border-t">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4">
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Link href={WEBSITE_HOME}>
            <Image
              src="/assets/images/logo-black.png"
              width={150}
              height={150}
              alt="Logo"
              className="lg:w-32 w-24 mb-2"
            />
          </Link>
          <p className="text-gray-500 text-sm">
            E-store is your trusted online destination for a wide range of
            products,Offering a convenient and secure shopping experience.
          </p>
        </div>

        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Categories</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href="">T-shirt</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Hoodies</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Oversized</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Full Sleeves</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Polo</Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">UserFull Links</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Shop</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">About</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Help Center</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href="">Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Login</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">My Account</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Privacy Policy</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Contact Us</h4>
          <ul>
            <li className="mb-2 text-gray-500 flex gap-2">
              <IoLocationOutline size={20} />
              <span className="text-sm">E-Store Shah Muhammad Twon Okara </span>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2">
              <MdOutlinePhone size={20} />
              <Link href="tel:+92 300 1234567" className="hover:text-primary text-sm">
                +92 300 1234567
              </Link>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2">
              <MdOutlineMailOutline size={20} />
              <Link
                href="mailto:support@estore.com"
                className="hover:text-primary text-sm"
              >
                support@estore.com
              </Link>
            </li>
          </ul>
          <div className="flex gap-5">
            <Link href="">
              <RiYoutubeLine size={25} className="hover:text-primary" />
            </Link>
            <Link href="">
              <FaWhatsapp size={25} className="hover:text-primary" />
            </Link>
            <Link href="">
              <FaInstagram size={25} className="hover:text-primary" />
            </Link>
            <Link href="">
              <RiFacebookCircleLine size={25} className="hover:text-primary" />
            </Link>
          </div>
        </div>
      </div>
         
      <div className="py-5 bg-gray-100" >
        <p className="text-center text-gray-500">
          &copy; 2026 E-Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
