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

import Dashboard from "./components/AdminDashboard/Dashboard";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="flex-1 container mx-auto px-1 py-0 max-w-8xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          {/* <Route path="/blogs" element={<Blogs />} /> */}
          <Route path='/contact' element={<Signup/>}/>
          <Route path='/blogsection' element={<BlogSection/>}/>
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/blog/:id" element={<BloShowgDetails />} />
          <Route path='/aboutsection' element={<AboutSection/>}/>
          <Route path='/projectsection' element={<ProjectSection/>}/>
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path='/contactsection' element={<ContactSection/>}/>
          <Route path='/signupsection' element={<SignUpSection/>}/>
          <Route path="/listings" element={<ListingsGrid />} />
          <Route path='/card' element={<ListingCard/>}/>
          <Route path='/admin' element={<Dashboard/>}/>
        </Routes>
      </main>
    </div>
  );
}
