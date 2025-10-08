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

//     const properties = [
//   {
//     title: "Premium 3BHK Apartment near Alipiri",
//     description: "Spacious flat with temple view, modern modular kitchen.",
//     location: "Tirupati, Andhra Pradesh",
//     price: 6500000,
//     bedrooms: 3,
//     propertyType: "Apartment",
//     images: [
//       "/images/one.jpg",
//     ],
//     rating: 4.5,
//     amenities: ["Lift", "Power Backup", "Car Parking", "24x7 Security"],
//     videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     square: 1450,
//     category_type: "sale", // e.g. sale | rent | lease | residential | commercial
//   },
//   {
//     title: "2BHK For Rent near Kapila Teertham",
//     description: "Semi-furnished, close to schools and supermarkets.",
//     location: "Tirupati",
//     price: 18000, // monthly rent
//     bedrooms: 2,
//     propertyType: "Apartment",
//     images: ["/images/two.jpg"],
//     rating: 4.1,
//     amenities: ["Lift", "RO Water", "CCTV"],
//     videoUrl: "",
//     square: 950,
//     category_type: "rent",
//   },
//   {
//     title: "Luxury Villa with Private Garden",
//     description: "Gated community villa with clubhouse access.",
//     location: "Bangalore, Karnataka",
//     price: 28500000,
//     bedrooms: 4,
//     propertyType: "Villa",
//     images: ["/images/three.jpg"],
//     rating: 4.8,
//     amenities: ["Clubhouse", "Pool", "Gym", "EV Charging"],
//     videoUrl: "https://player.vimeo.com/video/76979871",
//     square: 3200,
//     category_type: "residential",
//   },
//   {
//     title: "Commercial Space on MG Road",
//     description: "Prime retail frontage, high footfall area.",
//     location: "Bangalore, Karnataka",
//     price: 350000, // monthly lease
//     bedrooms: 2,
//     propertyType: "Commercial property",
//     images: ["/images/four.jpg"],
//     rating: 4.2,
//     amenities: ["Power Backup", "Visitor Parking"],
//     videoUrl: "",
//     square: 2200,
//     category_type: "commercial",
//   },
//   {
//     title: "Independent House near Leela Mahal Circle",
//     description: "Renovated, Vastu compliant with borewell.",
//     location: "Tirupati",
//     price: 9200000,
//     bedrooms: 3,
//     propertyType: "House",
//     images: ["/images/five.jpg"],
//     rating: 4.3,
//     amenities: ["Car Parking", "Borewell", "Solar Water Heater"],
//     videoUrl: "",
//     square: 1800,
//     category_type: "sale",
//   },
//   {
//     title: "Plug & Play Office",
//     description: "Furnished seats, conference room, pantry.",
//     location: "Hyderabad, Telangana",
//     price: 150000, // monthly rent
//     bedrooms: 0,
//     propertyType: "Office Space",
//     images: ["/images/six.jpg"],
//     rating: 4.0,
//     amenities: ["Generator", "AC", "CCTV", "Parking"],
//     videoUrl: "",
//     square: 1400,
//     category_type: "lease",
//   },
//   {
//     title: "RERA Approved Condo",
//     description: "Community living with sports arena and library.",
//     location: "Chennai, Tamil Nadu",
//     price: 7800000,
//     bedrooms: 3,
//     propertyType: "Condo",
//     images: ["/images/seven.jpg"],
//     rating: 4.6,
//     amenities: ["Pool", "Indoor Games", "Library", "Jogging Track"],
//     videoUrl: "",
//     square: 1600,
//     category_type: "residential",
//   },
//   {
//     title: "Premium Plot in Gated Layout",
//     description: "DTCP approved layout with 40 ft roads.",
//     location: "Tirupati (Renigunta Road)",
//     price: 3500000,
//     bedrooms: 0,
//     propertyType: "Land",
//     images: ["/images/eight.jpg"],
//     rating: 4.2,
//     amenities: ["Gated Entry", "Street Lights", "Drainage"],
//     videoUrl: "",
//     square: 2400, // plot area in sq ft
//     category_type: "sale",
//   },
//   {
//     title: "Studio Apartment near IT Park",
//     description: "Ideal for singles/working professionals.",
//     location: "Hyderabad",
//     price: 14000, // monthly rent
//     bedrooms: 1,
//     propertyType: "Studio",
//     images: ["/images/five.jpg"],
//     rating: 3.9,
//     amenities: ["Lift", "Security", "RO Water"],
//     videoUrl: "",
//     square: 520,
//     category_type: "rent",
//   }
// ];

// const properties = [
//   {
//     title: "Premium 3BHK Apartment near Alipiri",
//     description:
//       "Discover a thoughtfully designed 3BHK apartment nestled near Alipiri, where calm temple views meet everyday convenience. The home opens into a bright living area that invites natural light throughout the day, creating a warm ambiance for families and guests alike. A modern modular kitchen with ample storage, soft-close cabinetry, and a dedicated utility zone makes daily cooking efficient and enjoyable. Three well-proportioned bedrooms— including a serene master suite— offer privacy, comfort, and room to personalize. Premium vitrified flooring, sleek electrical fittings, and refined bathroom fixtures elevate the overall finish.\n\nThe apartment is positioned to give you the best of Tirupati living: quick access to schools, supermarkets, healthcare, and devotional landmarks while staying comfortably tucked away from rush-hour noise. Wide corridors, two elevators, 24x7 power backup, CCTV surveillance, and a secure entrance enhance safety and ease of movement. With cross-ventilation engineered across the plan, the home stays airy all year round— reducing reliance on artificial cooling and keeping utility bills in check.\n\nCommunity amenities include a landscaped sit-out, children’s play corner, visitor parking, and a residents’ association that maintains common areas with care. Whether you’re hosting friends over for a cozy evening or seeking a quiet corner to work from home, the layout adapts effortlessly to your routine. The temple-facing balconies add a spiritual calm— perfect for your morning coffee or an evening unwind. If you’re looking for a move-in-ready address that blends location, craftsmanship, and value, this apartment near Alipiri stands out as a balanced choice for end-use or investment.",
//     location: "Tirupati, Andhra Pradesh",
//     price: 6500000,
//     bedrooms: 3,
//     propertyType: "Apartment",
//     images: ["/images/one.jpg"],
//     rating: 4.5,
//     amenities: ["Lift", "Power Backup", "Car Parking", "24x7 Security"],
//     videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     square: 1450,
//     category_type: "Sale",
//   },
//   {
//     title: "2BHK For Rent near Kapila Teertham",
//     description:
//       "Set just minutes from Kapila Teertham, this practical 2BHK rental blends comfort, convenience, and value—ideal for couples, small families, or working professionals. The home welcomes you into a living area designed for efficiency, with a functional layout that makes furnishing a breeze. Large windows usher in daylight and keep the interiors ventilated, while energy-efficient lighting helps minimize monthly expenses. The semi-furnished setup includes essential cabinetry and wardrobes, so you can move in with minimal effort and customize the space at your own pace.\n\nIts compact yet well-zoned kitchen features workspace optimization and a separate washing nook, keeping chores organized. Bedrooms are crafted to maximize usable area, with provision for queen or king beds, study desks, and additional storage. The bathroom fittings are low-maintenance and durable— perfect for everyday use. A small balcony extends the living space, offering a quiet spot for reading or your morning tea.\n\nThe neighborhood shines for its connectivity: supermarkets, local eateries, schools, and public transport are all within easy reach. With CCTV, RO water, elevator access, and a well-maintained common lobby, the building emphasizes daily comfort and safety. Commuters will appreciate the quick access to key routes, while weekend explorers have parks and cultural landmarks close by. If you want an apartment that keeps life uncomplicated— easy to maintain, close to essentials, and fairly priced— this 2BHK near Kapila Teertham is a smart rental pick.",
//     location: "Tirupati",
//     price: 18000,
//     bedrooms: 2,
//     propertyType: "Apartment",
//     images: ["/images/two.jpg"],
//     rating: 4.1,
//     amenities: ["Lift", "RO Water", "CCTV"],
//     videoUrl: "",
//     square: 950,
//     category_type: "Rent",
//   },
//   {
//     title: "Luxury Villa with Private Garden",
//     description:
//       "This luxury villa in Bangalore balances elegant architecture with practical living, delivering an experience that feels exclusive yet effortless every day. The moment you step through the entrance, a double-height foyer and generous glazing create a sense of scale and light. The living and dining zones flow into an open, entertainer’s kitchen with a breakfast island, premium appliances, and a walk-in pantry— ensuring the home functions beautifully for gatherings and daily family life.\n\nFour spacious bedrooms, including a grand primary suite, provide retreat-like comfort. The primary bedroom features a walk-in wardrobe and a spa-inspired bath with premium sanitary fittings. A flexible family lounge upstairs can double as a media room or a quiet home office, while the ground-floor guest room ensures accessibility for elderly family members or visiting friends.\n\nOutdoors, a private garden wraps the living spaces with greenery— ideal for kids, pets, yoga, or weekend barbecues. Within the gated community, residents enjoy a clubhouse, swimming pool, gym, walking tracks, and curated events that foster neighborhood connection. EV charging readiness, 24x7 security, and power backup add the confidence of future-ready living.\n\nProximity to tech parks, international schools, healthcare, and shopping districts makes the location practical without compromising tranquility. If you’re seeking a villa that offers refined finishes, generous volume, and a lifestyle that balances wellness with convenience, this address is a standout in Bangalore’s premium residential segment.",
//     location: "Bangalore, Karnataka",
//     price: 28500000,
//     bedrooms: 4,
//     propertyType: "Villa",
//     images: ["/images/three.jpg"],
//     rating: 4.8,
//     amenities: ["Clubhouse", "Pool", "Gym", "EV Charging"],
//     videoUrl: "https://player.vimeo.com/video/76979871",
//     square: 3200,
//     category_type: "Residential",
//   },
//   {
//     title: "Commercial Space on MG Road",
//     description:
//       "Position your brand at a landmark address with this versatile commercial space on MG Road— a corridor known for visibility, premium co-tenancy, and constant footfall. Designed with a clear, column-light floor plate, the unit supports multiple formats: boutique retail, experience center, clinic, studio, or a high-impact flagship. The frontage is wide, allowing strong signage and window displays that capture walk-by and drive-by attention. Inside, the layout is straightforward to fit-out, with logical zones for reception, display/storage, service counters, and back-office use.\n\nPractical infrastructure— reliable power backup, well-maintained common areas, and visitors’ parking— keeps operations smooth. High pedestrian density and proximity to metro/bus routes improve staff commute and customer inflow alike. The surrounding ecosystem includes banks, cafés, premium retail, and established brands, creating a complementary environment that supports consistent foot traffic throughout the day.\n\nSecurity, housekeeping, and facility management are streamlined, freeing your team to focus on performance rather than maintenance. Whether you’re optimizing an omnichannel strategy or launching a new concept, this address helps shorten the awareness curve and improve conversion. If location, brand recall, and ease of operations are central to your business plan, this MG Road space delivers well-rounded value with the potential for long-term growth.",
//     location: "Bangalore, Karnataka",
//     price: 350000,
//     bedrooms: 2,
//     propertyType: "Commercial property",
//     images: ["/images/four.jpg"],
//     rating: 4.2,
//     amenities: ["Power Backup", "Visitor Parking"],
//     videoUrl: "",
//     square: 2200,
//     category_type: "Commercial",
//   },
//   {
//     title: "Independent House near Leela Mahal Circle",
//     description:
//       "A thoughtfully renovated independent house near Leela Mahal Circle, this home blends timeless comfort with practical updates. The layout is intuitive: a welcoming living room, a dining zone that connects effortlessly to the kitchen, and bedrooms that are sized for real life— with room for wardrobes, study tables, and personal touches. Vastu-aware planning optimizes energy flow and natural light, while the borewell ensures dependable water supply year-round.\n\nRenovation upgrades include low-maintenance flooring, fresh paint in calming tones, modern electricals, and efficient bathroom fixtures— all chosen for durability and ease of upkeep. The kitchen features upgraded counters and storage planning that keeps daily cooking tidy. A modest setback and veranda space allow for potted greens, morning tea, or a cozy reading corner. The plot ratio leaves future flexibility for extensions, an office nook, or a hobby studio.\n\nThe neighborhood offers everything within minutes: markets, schools, healthcare, and public transport— making routines smooth for families and working professionals. With on-site car parking and straightforward access roads, daily commutes stay predictable. Solar water provisions help trim utility costs while supporting a greener lifestyle.\n\nIf you want the independence of your own land and walls— without the compromises of shared living— this house delivers an appealing balance of location, comfort, and long-term value.",
//     location: "Tirupati",
//     price: 9200000,
//     bedrooms: 3,
//     propertyType: "House",
//     images: ["/images/five.jpg"],
//     rating: 4.3,
//     amenities: ["Car Parking", "Borewell", "Solar Water Heater"],
//     videoUrl: "",
//     square: 1800,
//     category_type: "Sale",
//   },
//   {
//     title: "Plug & Play Office",
//     description:
//       "Move in and get productive— this plug & play office in Hyderabad is designed for teams that value speed, convenience, and a professional first impression. The floor plan accommodates open workstations, private cabins, and a conference room equipped for presentations and video calls. A compact pantry supports quick breaks, while centralized air-conditioning and ample lighting ensure sustained comfort across long workdays.\n\nThe building provides 24x7 security, CCTV monitoring, power backup, and well-managed common areas, so your operations face minimal downtime. On-site and nearby parking options ease commute planning, while access to major roads and public transport expands your hiring radius. Thoughtful acoustics and separations help reduce distractions, making the space suitable for sales, design, and engineering teams alike.\n\nWith flexible seating and a neutral, modern interior palette, the space adapts to your brand identity and tech stack without heavy rework. As your team grows, the configuration can evolve— from hot desks to dedicated pods— with logical cable routing and storage to maintain a clean aesthetic. For companies seeking a ready office that balances cost with capability, this unit offers a smart middle ground between co-working and a full custom build.",
//     location: "Hyderabad, Telangana",
//     price: 150000,
//     bedrooms: 0,
//     propertyType: "Office Space",
//     images: ["/images/six.jpg"],
//     rating: 4.0,
//     amenities: ["Generator", "AC", "CCTV", "Parking"],
//     videoUrl: "",
//     square: 1400,
//     category_type: "Lease",
//   },
//   {
//     title: "RERA Approved Condo",
//     description:
//       "Experience community living done right in this RERA-approved condo in Chennai. The plan emphasizes comfort and practicality— a sunlit living area, efficient kitchen with utility, and three bedrooms that accommodate both rest and routine. Quality tiles, well-fitted wardrobes, and smart storage solutions help keep the home organized without feeling cramped. The balcony looks onto green views within the development, adding a welcome outdoor touch.\n\nThe project’s clubhouse is a genuine value-add: a pool for weekend laps, indoor games for evenings with friends, a library for quiet hours, and a jogging track that encourages a daily wellness habit. Professional maintenance teams keep the premises clean and responsive, while round-the-clock security, access control, and power backup provide peace of mind. The development’s RERA status brings transparency in approvals and timelines, building buyer confidence.\n\nLocated close to schools, hospitals, and shopping, the condo reduces commute time and makes daily errands easier. With upcoming infrastructure improvements in the area, long-term appreciation prospects improve further. Whether you’re seeking a stable family base or a rental-friendly asset, this condo strikes a compelling balance of price, amenities, and connectivity.",
//     location: "Chennai, Tamil Nadu",
//     price: 7800000,
//     bedrooms: 3,
//     propertyType: "Condo",
//     images: ["/images/seven.jpg"],
//     rating: 4.6,
//     amenities: ["Pool", "Indoor Games", "Library", "Jogging Track"],
//     videoUrl: "",
//     square: 1600,
//     category_type: "Residential",
//   },
//   {
//     title: "Premium Plot in Gated Layout",
//     description:
//       "Own a premium plot in a secure, well-planned gated layout off Renigunta Road— a location celebrated for its connectivity and steady growth. The layout features wide 40 ft internal roads, street lighting, and a defined drainage system, ensuring the community remains functional in all seasons. DTCP approvals provide regulatory clarity and simplify your next steps when you’re ready to build.\n\nThe plot size is generous for a custom home with lawn or a multi-level plan that balances private and shared zones. With flexible setbacks and favorable plot proportions, architects can deliver Vastu-aligned designs without compromising aesthetics. Utilities are plotted logically, making construction coordination smoother and cost-effective.\n\nThe wider neighborhood puts everyday essentials within a short drive— schools, healthcare, groceries, and places of worship— while arterial roads connect you quickly to transport hubs. For investors, the area’s trajectory suggests durable demand supported by local employment, education, and pilgrim inflows. If you’re ready to design a home around your lifestyle, or you want a tangible asset in a proven micromarket, this gated-layout plot is a prudent choice.",
//     location: "Tirupati (Renigunta Road)",
//     price: 3500000,
//     bedrooms: 0,
//     propertyType: "Land",
//     images: ["/images/eight.jpg"],
//     rating: 4.2,
//     amenities: ["Gated Entry", "Street Lights", "Drainage"],
//     videoUrl: "",
//     square: 2400,
//     category_type: "Sale",
//   },
//   {
//     title: "Studio Apartment near IT Park",
//     description:
//       "Compact, efficient, and easy to maintain— this studio apartment near Hyderabad’s IT Park is tailored for professionals who value time and convenience. The plan integrates a living/sleeping zone with a thoughtfully configured kitchenette, maximizing usable space for daily routines. Smart storage, a foldable dining/work surface, and well-placed lighting elevate functionality without visual clutter.\n\nLarge windows provide daylight and ventilation, keeping the interior fresh throughout the day. The modern bathroom is fitted with durable, low-maintenance fixtures that strike a balance between comfort and practicality. A petite balcony offers a breezy corner to read, sip coffee, or step away from screens.\n\nThe building’s essentials— elevator, security, RO water, and clean common areas— keep living simple. Being close to tech corridors shortens commutes, while the surrounding neighborhood offers cafés, groceries, pharmacies, and fitness options within minutes. For tenants, the location means dependable rental demand; for end-users, it translates to everyday convenience and lower transport costs.\n\nIf you want a well-located base that supports a fast-paced urban schedule, this studio pairs smart design with a pragmatic address— making it an appealing option for both residents and investors.",
//     location: "Hyderabad",
//     price: 14000,
//     bedrooms: 1,
//     propertyType: "Studio",
//     images: ["/images/five.jpg"],
//     rating: 3.9,
//     amenities: ["Lift", "Security", "RO Water"],
//     videoUrl: "",
//     square: 520,
//     category_type: "Rent",
//   }
// ];

// seedData.js

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
    videoUrl: "",
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
    images: ["/images/image.png"],
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
    videoUrl: "",
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
    videoUrl: "",
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
    videoUrl: "",
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
    videoUrl: "",
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
    videoUrl: "",
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
    videoUrl: "",
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
