import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Properties from './Pages/Properties';
import Blogs from './Pages/Blogs';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import BlogSection from './components/BlogSection';
import AboutSection from './components/AboutSection';
import ProjectSection from './components/ProjectSection';
import ContactSection from './components/ContactSection';
import SignUpSection from './components/SignUpSection';
import ListingsGrid from "./components/ListingsGrid";
import BlogDetails from "./components/BlogDetails";
import ListingCard from './components/ListingCard';
import ProjectDetails from "./components/ProjectDetails";
import BloShowgDetails from "./components/BlogDetails";
import ScrollToTop from './components/ScrollToTop';

// Admin pages
import AdminShell from './components/layout/AdminShell';
import RealEstateProperties from "./components/AdminDashboard/RealEstateProperties";
import RealEstateProjects from './components/AdminDashboard/RealEstateProjects';
import RealEstateFeatures from './components/AdminDashboard/RealEstateFeatures';
import RealEstateInvestors from './components/AdminDashboard/RealEstateInvestors';
import RealEstateFacilities from './components/AdminDashboard/RealEstateFacilities';
import RealEstateCategories from './components/AdminDashboard/RealEstateCategories';
import RealEstateCustomeFields from './components/AdminDashboard/RealEstateCustomeFields';
import Pages from './components/AdminDashboard/Pages';
import RealEstatePosts from './components/AdminDashboard/Blog/RealEstatePosts';




// Optional stubs for future pages
const AdminCategories = () => <div>Categories</div>;
const AdminReviews = () => <div>Reviews</div>;
const AdminCustomFields = () => <div>Custom Fields</div>;

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {/* <Navbar /> */}
      <main className="flex-1 container mx-auto px-1 py-0 max-w-8xl">
        <Routes>
          {/* Public routes (unchanged) */}
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          {/* <Route path="/blogs" element={<Blogs />} /> */}
          <Route path="/contact" element={<Signup />} />
          <Route path="/blogsection" element={<BlogSection />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/blog/:id" element={<BloShowgDetails />} />
          <Route path="/aboutsection" element={<AboutSection />} />
          <Route path="/projectsection" element={<ProjectSection />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/contactsection" element={<ContactSection />} />
          <Route path="/signupsection" element={<SignUpSection />} />
          <Route path="/listings" element={<ListingsGrid />} />
          <Route path="/card" element={<ListingCard />} />


           {/* Admin Routes */}
            <Route path="/admin" element={<AdminShell />}>
            <Route path="real-estate/properties" element={<RealEstateProperties />} />
            <Route path='real-estate/projects' element = {<RealEstateProjects/>}/>
            <Route path='real-estate/features' element = {<RealEstateFeatures/>} />
            <Route path='real-estate/investors' element = {<RealEstateInvestors/>} />
            <Route path='real-estate/facilities' element = {<RealEstateFacilities/>} />
            <Route path='real-estate/categories' element = {<RealEstateCategories/>} />
            <Route path='real-estate/custom-fields' element = {<RealEstateCustomeFields/>} />
            <Route path='pages' element = {<Pages/>}/>
            <Route path='blog/posts' element = {<RealEstatePosts/>}/>
          </Route>
        </Routes>
      </main>
    </div>
  );
}
