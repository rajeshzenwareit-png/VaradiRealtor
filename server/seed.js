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
      "A practical 3BHK near Alipiri with a clear, efficient layout for daily living. The living–dining zone supports routine use and small gatherings, while large openings provide daylight and ventilation. The kitchen follows an ergonomic triangle with adequate counters and storage. Three bedrooms allow privacy; the primary fits a king bed and full wardrobes. Bathrooms use durable finishes for easy upkeep. Building features include elevators, common-area CCTV, power backup for essentials, and covered parking. Broadband readiness suits hybrid work. The location connects quickly to schools, groceries, healthcare, and transport. Overall, a low-maintenance apartment in a calm residential pocket with dependable infrastructure.",
    location: "Tirupati, Andhra Pradesh",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 6500000,
    bedrooms: 3,
    propertyType: "Apartment",
    images: ["/images/agastya.jpg"],
    rating: 4.5,
    amenities: [
      "Lift",
      "Power Backup",
      "Car Parking",
      "24x7 Security",
      "CCTV Surveillance",
      "Rainwater Harvesting",
      "Intercom Facility",
      "Visitor Parking",
      "Fire Safety"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    square: 1450,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "2BHK For Rent near Kapila Teertham",
    description:
      "A well-located 2BHK rental close to Kapila Teertham, prioritising accessibility and value. The living area fits standard seating and a compact work corner. The dining niche adjoins a ventilated kitchen with base/overhead cabinets and practical counter space. Two bedrooms provide flexibility for a primary suite plus a secondary room or office. Bathrooms use easy-clean finishes for predictable maintenance. The building typically offers lift access, secure entry, and common-area CCTV. Water supply and backup for shared services improve daily reliability. Broadband readiness supports remote work. With markets, clinics, schools, and bus stops nearby, commute and errands are efficient—an affordable, low-maintenance home in central Tirupati.",
    location: "Tirupati",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 18000,
    bedrooms: 2,
    propertyType: "Apartment",
    images: ["/images/ecogreen.jpg"],
    rating: 4.1,
    amenities: [
      "Lift",
      "RO Water",
      "CCTV",
      "24x7 Security",
      "Covered Two-Wheeler Parking",
      "Power Backup (Common Areas)",
      "Visitor Parking",
      "Waste Segregation",
      "Intercom"
    ],
    videoUrl: "https://www.youtube.com/watch?v=Mn6HAAnU9q4",
    square: 950,
    category_type: "Rent",
    brochureUrl: "/images/HARE_RAMA_GREEN_CITY_MARKING_PLOTS_ARE_COMPLETED_Nagari.pdf",
  },
  {
    title: "Luxury Villa with Private Garden",
    description:
      "Bangalore villa with a functional plan and private garden suited to daily use and seasonal entertaining. The ground floor includes living, dining, powder room, and a kitchen with island or breakfast counter. Large openings enhance light, ventilation, and views. Upper levels offer a primary suite with wardrobe wall and seating, plus secondary bedrooms for family or guests. Ensuite baths use modern fittings with effective ventilation. A first-floor family area supports media or study. Provision for multi-car parking, home automation, security, and high-speed internet improves usability. Close to schools, healthcare, retail, and business corridors, the home balances representational spaces with durable everyday functionality.",
    location: "Bangalore, Karnataka",
    country: "India",
    stateName: "Karnataka",
    city: "Bangalore",
    price: 28500000,
    bedrooms: 4,
    propertyType: "Villa",
    images: ["/images/img.jpg"],
    rating: 4.8,
    amenities: [
      "Clubhouse",
      "Pool",
      "Gym",
      "EV Charging",
      "Landscaped Garden",
      "Home Automation Ready",
      "24x7 Security",
      "CCTV Perimeter",
      "Rainwater Harvesting"
    ],
    videoUrl:
      "https://www.youtube.com/watch?v=FA6mSHPM5z8&list=PLUs62aqkjy8lFWZON72434Sf4kXVAHdzk&index=8",
    square: 3200,
    category_type: "Residential",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Commercial Space on MG Road",
    description:
      "MG Road commercial unit with rectangular floor plate for flexible fit-outs: open office, cabinised consulting, or retail display grids. Generous frontage supports signage; glazing improves daylight and visibility. Lift and stair cores aid circulation; nearby parking supports short and medium-stay visits. Electrical backbone accommodates POS, desktops, and display lighting; backup in common areas aids continuity. CCTV in shared zones, structured access, and fire safety improve compliance. Surrounded by banks, eateries, and transit, the address brings reliable footfall and staff access. HVAC provisioning and ceiling grids simplify climate and lighting design. A rational platform for brands seeking visibility and operational predictability.",
    location: "Bangalore, Karnataka",
    country: "India",
    stateName: "Karnataka",
    city: "Bangalore",
    price: 350000,
    bedrooms: 2,
    propertyType: "Commercial property",
    images: ["/images/s.jpg"],
    rating: 4.2,
    amenities: [
      "Power Backup",
      "Visitor Parking",
      "CCTV",
      "Fire Safety System",
      "High Footfall Location",
      "Elevator Access",
      "Signage Opportunity",
      "Server/Network Ready"
    ],
    videoUrl: "https://www.youtube.com/watch?v=lpzEd8gpWVM",
    square: 2200,
    category_type: "Commercial",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Independent House near Leela Mahal Circle",
    description:
      "Independent house near Leela Mahal Circle in a mature neighbourhood. Front setback allows a sit-out or planting strip. Ground floor provides living, dining, and a ventilated kitchen with clear work zones. Bedrooms accommodate wardrobes and study tables without obstructing movement. Bathrooms use robust, low-maintenance finishes. Cross-ventilation helps regulate indoor temperature. Parking suits a car and two-wheelers; street width usually enables easy manoeuvring. Essentials—retail, medical shops, schools, and transport—are nearby, reducing errand time. Electrical distribution supports typical appliances, and water is available via municipal and borewell sources. A practical choice for families preferring independence and for investors seeking stable, end-user demand.",
    location: "Tirupati",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 9200000,
    bedrooms: 3,
    propertyType: "House",
    images: ["/images/five.jpg"],
    rating: 4.3,
    amenities: [
      "Car Parking",
      "Borewell",
      "Solar Water Heater",
      "Compound Wall",
      "CCTV Ready Wiring",
      "Rainwater Harvesting",
      "Study/Work Nook Provision",
      "Water Storage Tanks",
      "LED Lighting"
    ],
    videoUrl: "https://www.youtube.com/watch?v=FTGkCx46L3w",
    square: 1800,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Plug & Play Office",
    description:
      "Hyderabad plug-and-play office designed to minimise setup time and maintain professional client interaction. Compact reception and waiting area lead to an open workstation bay sized for standard desks. Glass cabins preserve light while enabling privacy. A meeting room with display wall suits presentations and reviews. Server/IT closet secures network gear; pantry placement reduces disruption. Power and data points support varied seating charts; provision for UPS where needed. Common-area CCTV, elevator access, and backup for shared services aid continuity. Parking and nearby transit improve commuting. Ideal for startups or project pods seeking quick occupancy, branding opportunities, and predictable operating conditions.",
    location: "Hyderabad, Telangana",
    country: "India",
    stateName: "Telangana",
    city: "Hyderabad",
    price: 150000,
    bedrooms: 0,
    propertyType: "Office Space",
    images: ["/images/six.jpg"],
    rating: 4.0,
    amenities: [
      "Generator",
      "AC",
      "CCTV",
      "Parking",
      "Reception Area",
      "Conference Room",
      "Server Room",
      "Access Control Ready",
      "Housekeeping in Commons"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ec_fXMrD7Ow",
    square: 1400,
    category_type: "Lease",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "RERA Approved Condo",
    description:
      "3BHK condo in a RERA-registered project in Chennai, planned for everyday usability and community support. Layout offers a contiguous living–dining zone with daylight, and bedrooms set back for privacy. The kitchen employs durable finishes, organised storage, and ventilation. Bathrooms feature anti-skid tiles and branded fittings. Master plan prioritises green pockets, walkability, and separation of vehicular and pedestrian movement. Clubhouse facilities include gym, indoor games, multipurpose hall, pool, and jogging track. Security uses controlled access and CCTV in common areas. Rainwater harvesting, waste segregation, and water treatment aid service stability. Close to schools, healthcare, retail, and transit—suitable for city upgraders and investors.",
    location: "Chennai, Tamil Nadu",
    country: "India",
    stateName: "Tamil Nadu",
    city: "Chennai",
    price: 7800000,
    bedrooms: 3,
    propertyType: "Condo",
    images: ["/images/seven.jpg"],
    rating: 4.6,
    amenities: [
      "Pool",
      "Indoor Games",
      "Library",
      "Jogging Track",
      "Clubhouse",
      "24x7 Security",
      "CCTV",
      "Rainwater Harvesting",
      "Sewage Treatment Plant"
    ],
    videoUrl: "https://www.youtube.com/watch?v=wsQBs_QRexA",
    square: 1600,
    category_type: "Residential",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Premium Plot in Gated Layout",
    description:
      "Residential plot off Renigunta Road within a gated layout focused on controlled access, utilities, and legible streets. Wide internal roads enable two-way movement; plot demarcations and signage simplify planning. Street lighting and storm-water drainage improve evening and monsoon use. Green buffers and small parks support walking loops and micro-climate comfort. The format allows tailored setbacks, room sizes, and phased expansion subject to regulations. The address is close to schools, healthcare, retail, and public transport for convenient daily living. Suitable for self-use or investment, with low maintenance and appreciation potential linked to corridor growth and civic improvements. Conduct standard title and utility due diligence.",
    location: "Tirupati (Renigunta Road)",
    country: "India",
    stateName: "Andhra Pradesh",
    city: "Tirupati",
    price: 3500000,
    bedrooms: 0,
    propertyType: "Land",
    images: ["/images/eight.jpg"],
    rating: 4.2,
    amenities: [
      "Gated Entry",
      "Street Lights",
      "Drainage",
      "Security Cabin",
      "Avenue Plantation",
      "Internal Wide Roads"
    ],
    videoUrl: "https://www.youtube.com/watch?v=IR_ZR5T2s9U",
    square: 2400,
    category_type: "Sale",
    brochureUrl: "/images/bodagalatownshiplayoutvenkatagiri.pdf",
  },
  {
    title: "Studio Apartment near IT Park",
    description:
      "Compact studio in Hyderabad’s tech corridor, optimised for low-maintenance living. Open plan supports a sofa-bed, two-seater dining, and study desk. The kitchenette consolidates essentials with overhead shelving and base cabinets. A ventilated bathroom with contemporary fittings simplifies cleaning. Daylight through the main opening reduces daytime lighting needs; at night, zoned LED fixtures offer task and ambient light. Building conveniences typically include lift access, secure entry, and CCTV in common areas. Broadband connectivity supports hybrid work and study. Steps from offices, cafes, groceries, gyms, and transit, the unit suits single occupants or students seeking affordability, proximity, and straightforward, lock-and-leave functionality.",
    location: "Hyderabad",
    country: "India",
    stateName: "Telangana",
    city: "Hyderabad",
    price: 14000,
    bedrooms: 1,
    propertyType: "Studio",
    images: ["/images/five.jpg"],
    rating: 3.9,
    amenities: [
      "Lift",
      "Security",
      "RO Water",
      "CCTV",
      "Power Backup (Common Areas)",
      "Broadband Ready",
      "Bicycle Parking",
      "Intercom",
      "LED Corridor Lighting"
    ],
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
