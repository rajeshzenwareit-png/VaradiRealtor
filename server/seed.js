import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Property from "./models/Property.js";
import Agent from "./models/Agent.js";
import Blog from "./models/Blog.js";
import Review from "./models/Review.js";
import {Category}  from "./models/Categories.js";
import { Feature } from "./models/Feature.js";

// Load env variables
dotenv.config();

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Property.deleteMany();
    await Agent.deleteMany();
    await Blog.deleteMany();
    await Review.deleteMany();
    await Category.deleteMany();
    await Feature.deleteMany();



    // Sample data


const properties = [
  {
    title: "Premium 3BHK Apartment near Alipiri",
    description:
      "Discover a thoughtfully designed 3BHK apartment nestled near Alipiri, where calm temple views meet everyday convenience...",
    location: "Tirupati, Andhra Pradesh",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 6500000,
    bedrooms: 3,
    propertyType: "Apartment",
    images: ["/images/agastya.jpg"],
    rating: 4.5,
    amenities: ["Lift", "Power Backup", "Car Parking", "24x7 Security"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    square: 1450,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
    // brochureFileName: "bodagalatownshiplayoutvenkatagiri.pdf",

  },
  {
    title: "2BHK For Rent near Kapila Teertham",
    description:
      "Set just minutes from Kapila Teertham, this practical 2BHK rental blends comfort, convenience, and value...",
    location: "Tirupati",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 18000,
    bedrooms: 2,
    propertyType: "Apartment",
    images: ["/images/ecogreen.jpg"],
    rating: 4.1,
    amenities: ["Lift", "RO Water", "CCTV"],
    videoUrl: "https://www.youtube.com/watch?v=Mn6HAAnU9q4",
    square: 950,
    category_type: "Rent",
    brochureUrl: "/images/HARE_RAMA_GREEN_CITY_MARKING_PLOTS_ARE_COMPLETED_Nagari.pdf",
  },
  {
    title: "Luxury Villa with Private Garden",
    description:
      "This luxury villa in Bangalore balances elegant architecture with practical living...",
    location: "Bangalore, Karnataka",
    country: "India",
    stateName: "Karnataka",
    city: "Bangalore",
    price: 28500000,
    bedrooms: 4,
    propertyType: "Villa",
    images: ["/images/img.jpg"],
    rating: 4.8,
    amenities: ["Clubhouse", "Pool", "Gym", "EV Charging"],
    videoUrl: "https://www.youtube.com/watch?v=FA6mSHPM5z8&list=PLUs62aqkjy8lFWZON72434Sf4kXVAHdzk&index=8",
    square: 3200,
    category_type: "Residential",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Commercial Space on MG Road",
    description:
      "Position your brand at a landmark address with this versatile commercial space on MG Road...",
    location: "Bangalore, Karnataka",
    country: "India",
    stateName: "Karnataka",
    city: "Bangalore",
    price: 350000,
    bedrooms: 2,
    propertyType: "Commercial property",
    images: ["/images/s.jpg"],
    rating: 4.2,
    amenities: ["Power Backup", "Visitor Parking"],
    videoUrl: "https://www.youtube.com/watch?v=lpzEd8gpWVM",
    square: 2200,
    category_type: "Commercial",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Independent House near Leela Mahal Circle",
    description:
      "A thoughtfully renovated independent house near Leela Mahal Circle...",
    location: "Tirupati",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 9200000,
    bedrooms: 3,
    propertyType: "House",
    images: ["/images/five.jpg"],
    rating: 4.3,
    amenities: ["Car Parking", "Borewell", "Solar Water Heater"],
    videoUrl: "https://www.youtube.com/watch?v=FTGkCx46L3w",
    square: 1800,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Plug & Play Office",
    description:
      "Move in and get productive— this plug & play office in Hyderabad...",
    location: "Hyderabad, Telangana",
    country: "India",
    stateName: "Telangana",
    city: "Hyderabad",
    price: 150000,
    bedrooms: 0,
    propertyType: "Office Space",
    images: ["/images/six.jpg"],
    rating: 4.0,
    amenities: ["Generator", "AC", "CCTV", "Parking"],
    videoUrl: "https://www.youtube.com/watch?v=ec_fXMrD7Ow",
    square: 1400,
    category_type: "Lease",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "RERA Approved Condo",
    description:
      "Experience community living done right in this RERA-approved condo in Chennai...",
    location: "Chennai, Tamil Nadu",
    country: "India",
    stateName: "Tamil Nadu",
    city: "Chennai",
    price: 7800000,
    bedrooms: 3,
    propertyType: "Condo",
    images: ["/images/seven.jpg"],
    rating: 4.6,
    amenities: ["Pool", "Indoor Games", "Library", "Jogging Track"],
    videoUrl: "https://www.youtube.com/watch?v=wsQBs_QRexA",
    square: 1600,
    category_type: "Residential",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Premium Plot in Gated Layout",
    description:
      "Own a premium plot in a secure, well-planned gated layout off Renigunta Road...",
    location: "Tirupati (Renigunta Road)",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 3500000,
    bedrooms: 0,
    propertyType: "Land",
    images: ["/images/eight.jpg"],
    rating: 4.2,
    amenities: ["Gated Entry", "Street Lights", "Drainage"],
    videoUrl: "https://www.youtube.com/watch?v=IR_ZR5T2s9U",
    square: 2400,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Studio Apartment near IT Park",
    description:
      "Compact, efficient, and easy to maintain— this studio apartment near Hyderabad’s IT Park...",
    location: "Hyderabad",
    country: "India",
    stateName: "Telangana",
    city: "Hyderabad",
    price: 14000,
    bedrooms: 1,
    propertyType: "Studio",
    images: ["/images/five.jpg"],
    rating: 3.9,
    amenities: ["Lift", "Security", "RO Water"],
    videoUrl: "https://www.youtube.com/watch?v=FTGkCx46L3w",
    square: 520,
    category_type: "Rent",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
];









    const agents = [
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
      {
        name: "Vamseedharsainathuni",
        phone: "+91 9000070795",
        email: "Vamseedharsainathuni@gmail.com",
        avatar: "",
        about: "Experienced agent in Tirupati",
      },
    ];

    const blogs = [
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
      {
        title: "First Home Buying Guide",
        excerpt: "Tips for new buyers",
        content: "Full blog content...",
      },
    ];

    const reviews = [
      {
        name: "Rajesh",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=GJRtGP7ecFk&list=RDKn9ShAvI5pI&index=2"

      },
      {
        name: "Satheesh",
        rating: 4,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=lpzEd8gpWVM"
      },
      {
        name: "Ramswaroop",
        rating: 3,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=y9j-BL5ocW8"
      },
      {
        name: "Jachuel Lee",
        rating: 4,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
      {
        name: "Jachuel Lee",
        rating: 2,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=2v_7UH_nLv4"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=rutCVOOj4KQ"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
      {
        name: "Jachuel Lee",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet",
        video_review:"https://www.youtube.com/watch?v=4jnzf1yj48M"
      },
    ];


   const categories = [
  { name: "House",         iconClass: "fa-solid fa-house",     colorClass: "text-blue-600" },
  { name: "Apartments",    iconClass: "fa-solid fa-building",  colorClass: "text-green-600" },
  { name: "Environment",   iconClass: "fa-solid fa-leaf",      colorClass: "text-emerald-500" },
  { name: "Office Spaces", iconClass: "fa-solid fa-briefcase", colorClass: "text-purple-600" },
  { name: "Villas",        iconClass: "fa-solid fa-hotel",     colorClass: "text-pink-600" },
  { name: "Studios",       iconClass: "fa-solid fa-warehouse", colorClass: "text-orange-600" },
  { name: "Commercial",    iconClass: "fa-solid fa-city",      colorClass: "text-indigo-600" },
  { name: "Retail",        iconClass: "fa-solid fa-store",     colorClass: "text-red-600" },
  { name: "Banglow-Rajesh",        iconClass: "fa-solid fa-warehouse",     colorClass: "text-sky-600" }
];

const features = [
  { "icon": "FaHome",        "text": "Residential Homes", "desc": "Explore modern villas and family houses designed for comfort and style.", "sortOrder": 1 },
  { "icon": "FaBuilding",    "text": "Commercial Spaces", "desc": "Discover offices, retail outlets, and business properties in prime locations.", "sortOrder": 2 },
  { "icon": "FaMapMarkedAlt","text": "Prime Locations",   "desc": "Find properties near schools, workplaces, and city hotspots with ease.",   "sortOrder": 3 },
  { "icon": "FaHandshake",   "text": "Trusted Deals",     "desc": "Secure, transparent, and hassle-free property buying, selling, and renting.", "sortOrder": 4 },
  { "icon": "FaMoneyBillWave","text": "Best Prices",      "desc": "Get competitive pricing and maximize returns on your investments.", "sortOrder": 5 },
  { "icon": "FaUserTie",     "text": "Expert Agents",     "desc": "Work with our professional advisors for smooth property transactions.", "sortOrder": 6 }
  // { "icon": "FaUserTie",     "text": "Expert Agents",     "desc": "Work with our professional advisors for smooth property transactions.", "sortOrder": 7 },
  
]


const items = [
  {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    title: "Tirupati Market Pulse",
    text:
      "New launches and price trends across prime localities—what buyers and investors should track this quarter.",
    longText:
      "New launches are clustering near key arterial roads and IT corridors. Absorption remains strong for 2BHK and compact 3BHK segments, with steady appreciation in well-amenitized projects. Watch discounts on near-possession units, and keep an eye on infra announcements that can shift micro-market demand.",
  },
  {
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
    title: "Home Loan Basics",
    text:
      "From eligibility to interest types, a quick primer on choosing the right financing partner for your purchase.",
    longText:
      "Compare fixed vs floating rates, processing fees, and prepayment charges. Get a sanction letter early to strengthen bargaining. Keep FOIR in check and build a buffer for registration and fit-out costs. A small rate difference compounds—shop around.",
  },
  {
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
    title: "Vastu & Layout",
    text:
      "Simple layout tweaks that improve light, airflow, and overall comfort without breaking your budget.",
    longText:
      "Prioritize cross-ventilation, natural light, and sensible furniture circulation. Shift heavy storage away from openings, use lighter palettes, and align wet areas logically. Small orientation tweaks can make compact homes feel larger and calmer.",
  },
];


    // Insert sample data
    await Property.insertMany(properties);
    await Agent.insertMany(agents);
    await Blog.insertMany(items);
    await Review.insertMany(reviews);
    await Category.insertMany(categories);
    await Feature.insertMany(features);

    console.log("Seeded successfully");


    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
