import React, {useState} from 'react';
import Hero from '../components/Hero';
import ListingsGrid from '../components/ListingsGrid';
import Categories from '../components/Categories';
import Agents from '../components/Agents';
import Testimonials from '../components/Testimonials';
import CustomGrid from '../components/Customgrid';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";
import ExclusiveBanner from '../components/ExclusiveBanner';
import Footer from '../components/Footer';
import BlogShowcase from '../components/BlogShowcase';
import RealEstateVideoReviews from '../components/RealEstateVideoReviews';
import Signup from '../components/Signup';
import HeroSearch from "../components/HeroSearch";


export default function Home() {
   const [results, setResults] = useState([]);
  return (
    <>
      <Hero />
      <ExclusiveBanner/>
      <section 
      id="gridlist"
      className=" scroll-mt-24 w-full mt-12 overflow-hidden bg-gray-200 rounded-lg shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <a
            href="/properties"
            className="text-sm sm:text-base text-gray-500 hover:text-gray-700"
          >
            View all
          </a>
        </div>
        <ListingsGrid items={results} />
      </section>

      <Categories />
      <CustomGrid />
      <BlogShowcase/>
      <RealEstateVideoReviews/>
      {/* <Signup/> */}
      <Footer/>
    </>
  );
}
