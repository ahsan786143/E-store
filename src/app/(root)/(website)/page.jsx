
import FeatureProduct from "@/components/website/FeatureProduct";
import MainSlider from "@/components/website/MainSlider";
import Testimonial from "@/components/website/Testimonial";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiSupport } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";


const Home = () => {
  return (
    <>
      <section>
        <MainSlider />
      </section>
      <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
        <div className="grid grid-cols-2 sm:gap-10 pag-2">
          <div className="border rounded-lg overflow-hidden">
            <Link href="" >
              <Image
                src="/assets/images/banner1.png"
                width={600}
                height={600}
                alt="banner1"
                className="transition-all hover:scale-110"
              />
            </Link>
          </div>
          <div className="border rounded-lg overflow-hidden ">
            <Link href="" >
              <Image
                src="/assets/images/banner2.png"
                width={600}
                height={600}
                alt="banner1"
                className="transition-all hover:scale-110"
              />
            </Link>
          </div>
        </div>
      </section>

      <FeatureProduct />
      <section className="sm:pt-20 pt-5 pb-10">
        <Image
         src={"/assets/images/advertising-banner.png"}
         width={1200}
         height={600}
         alt="Advertisement"
        
        />

      </section>
      <Testimonial/>
      <section className="bg-gray-50 lg:px-32 px-4 border-t py-10">
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
          <div className="text-center">
            <p className="flex justify-center items-center mb-3 ">
              <GiReturnArrow size={30} />
            </p>
            <h3 className="text-xl font-semibold">7-Days Return</h3>
            <p> Risk-free shopping with easy return</p>

          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3 ">
              <FaShippingFast size={30} />
            </p>
            <h3 className="text-xl font-semibold">Free Shipping</h3>
            <p> No extra cost, just the price you see</p>

          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3 ">
              <BiSupport size={30} />
            </p>
            <h3 className="text-xl font-semibold">24/7 Support</h3>
            <p>24/7 support, always here just for you</p>

          </div>
          <div className="text-center">
            <p className="flex justify-center items-center mb-3 ">
              <TbRosetteDiscountCheckFilled size={30} />
            </p>
            <h3 className="text-xl font-semibold">Member Discount</h3>
            <p> Special Offer for our loyal customers</p>

          </div>

        </div>

      </section>
    </>
  );
};

export default Home;
