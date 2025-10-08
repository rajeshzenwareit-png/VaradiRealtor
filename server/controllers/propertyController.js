// controllers/properties.js
import Property from "../models/Property.js";

// GET all properties (unchanged)
export const getProperties = async (req, res) => {
  try {
    const {
      type,
      location,
      bedrooms,
      price,
      pricerange,
      minPrice,
      maxPrice,
      hasVideo,

      // ✅ existing filters
      category_type,  // preferred (matches schema)
      category,       // alias
      square,
      minSquare,
      maxSquare,

      // ✅ location hierarchy filters
      country,
      stateName,
      city,

      // optional pagination cap
      limit
    } = req.query;

    const filter = {};

    // propertyType
    if (type) filter.propertyType = new RegExp(type, "i");

    // location (legacy, free-text)
    if (location) filter.location = new RegExp(location, "i");

    // bedrooms
    if (bedrooms) {
      const beds = Number(String(bedrooms).replace(/,/g, ""));
      if (!Number.isNaN(beds)) filter.bedrooms = beds;
    }

    // price
    if (price !== undefined && price !== "") {
      const exact = Number(String(price).replace(/,/g, ""));
      if (!Number.isNaN(exact)) filter.price = exact;
    } else {
      let min = (minPrice ?? "") !== "" ? Number(String(minPrice).replace(/,/g, "")) : undefined;
      let max = (maxPrice ?? "") !== "" ? Number(String(maxPrice).replace(/,/g, "")) : undefined;

      if (pricerange && min === undefined && max === undefined) {
        const [a, b] = String(pricerange).replace(/\s/g, "").split("-");
        if (a) min = Number(a.replace(/,/g, ""));
        if (b) max = Number(b.replace(/,/g, ""));
      }

      if (min !== undefined || max !== undefined) {
        filter.price = {};
        if (min !== undefined && !Number.isNaN(min)) filter.price.$gte = min;
        if (max !== undefined && !Number.isNaN(max)) filter.price.$lte = max;
        if (Object.keys(filter.price).length === 0) delete filter.price;
      }
    }

    // ✅ category_type
    const cat = (category_type ?? category)?.toString().trim();
    if (cat) {
      filter.category_type = new RegExp(cat, "i");
    }

    // ✅ square
    if (square !== undefined && square !== "") {
      const sqExact = Number(String(square).replace(/,/g, ""));
      if (!Number.isNaN(sqExact)) filter.square = sqExact;
    } else {
      let sqMin = (minSquare ?? "") !== "" ? Number(String(minSquare).replace(/,/g, "")) : undefined;
      let sqMax = (maxSquare ?? "") !== "" ? Number(String(maxSquare).replace(/,/g, "")) : undefined;

      if (sqMin !== undefined || sqMax !== undefined) {
        filter.square = {};
        if (sqMin !== undefined && !Number.isNaN(sqMin)) filter.square.$gte = sqMin;
        if (sqMax !== undefined && !Number.isNaN(sqMax)) filter.square.$lte = sqMax;
        if (Object.keys(filter.square).length === 0) delete filter.square;
      }
    }

    // ✅ country / state / city
    if (country) filter.country = new RegExp(country, "i");
    if (stateName) filter.stateName = new RegExp(stateName, "i");
    if (city) filter.city = new RegExp(city, "i");

    // 🎥 hasVideo
    if (hasVideo === "1") {
      filter.videoUrl = { $exists: true, $ne: "" };
    }

    const cap = Math.min(Number(limit) || 50, 100); // safety cap
    const props = await Property.find(filter).limit(cap);

    res.json(props);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET property by ID (unchanged)
export const getPropertyById = async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ error: "Property not found" });
    res.json(prop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE property (only added brochure fields)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      price,
      bedrooms,
      propertyType,
      images,
      rating,
      amenities,
      videoUrl,

      // ✅ new fields
      square,
      category_type,
      category, // alias
      country,
      stateName,
      city,

      // ✅ NEW brochure fields
      brochureUrl,
      brochureFileName,
    } = req.body;

    const newProperty = new Property({
      title,
      description,
      location,
      price,
      bedrooms,
      propertyType,
      images: Array.isArray(images) ? images : [],
      rating,
      amenities: Array.isArray(amenities) ? amenities : [],

      // ✅ new fields
      square: typeof square === "number" ? square : (square ? Number(String(square).replace(/,/g, "")) : undefined),
      category_type: (category_type ?? category)?.toString().trim() || undefined,
      country: country?.toString().trim(),
      stateName: stateName?.toString().trim(),
      city: city?.toString().trim(),

      // sanitize video
      videoUrl: typeof videoUrl === "string" ? videoUrl.trim() : undefined,

      // ✅ NEW brochure fields
      brochureUrl: typeof brochureUrl === "string" ? brochureUrl.trim() : undefined,
      brochureFileName: typeof brochureFileName === "string" ? brochureFileName.trim() : undefined,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE property (only added brochure normalization)
export const updateProperty = async (req, res) => {
  try {
    const updateDoc = { ...req.body };

    // normalize videoUrl
    if ("videoUrl" in updateDoc) {
      if (typeof updateDoc.videoUrl === "string") {
        updateDoc.videoUrl = updateDoc.videoUrl.trim();
      } else if (updateDoc.videoUrl == null) {
        updateDoc.videoUrl = "";
      }
    }

    // ✅ normalize category_type (support alias)
    if ("category" in updateDoc && !("category_type" in updateDoc)) {
      updateDoc.category_type = String(updateDoc.category ?? "").trim();
      delete updateDoc.category;
    }
    if ("category_type" in updateDoc && typeof updateDoc.category_type === "string") {
      updateDoc.category_type = updateDoc.category_type.trim();
    }

    // ✅ normalize square
    if ("square" in updateDoc) {
      const n = Number(String(updateDoc.square).replace(/,/g, ""));
      updateDoc.square = Number.isNaN(n) ? undefined : n;
    }

    // ✅ normalize location fields
    if ("country" in updateDoc && typeof updateDoc.country === "string") {
      updateDoc.country = updateDoc.country.trim();
    }
    if ("stateName" in updateDoc && typeof updateDoc.stateName === "string") {
      updateDoc.stateName = updateDoc.stateName.trim();
    }
    if ("city" in updateDoc && typeof updateDoc.city === "string") {
      updateDoc.city = updateDoc.city.trim();
    }

    // ✅ NEW: brochure fields
    if ("brochureUrl" in updateDoc) {
      if (typeof updateDoc.brochureUrl === "string") {
        updateDoc.brochureUrl = updateDoc.brochureUrl.trim();
      } else if (updateDoc.brochureUrl == null) {
        updateDoc.brochureUrl = "";
      }
    }
    if ("brochureFileName" in updateDoc && typeof updateDoc.brochureFileName === "string") {
      updateDoc.brochureFileName = updateDoc.brochureFileName.trim();
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateDoc },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Property not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
