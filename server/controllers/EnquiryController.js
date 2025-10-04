import Enquiry from "../models/Enquiry.js";
import { z } from "zod";

const phoneRegex = /^(?:\+?\d{1,3}[-.\s]?)?(?:\d{3,5}[-.\s]?){2,4}\d{2,6}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120, "Name is too long"),
  email: z.string().trim().toLowerCase().regex(emailRegex, "Invalid email"),
  phone: z.string().trim().min(8, "Phone is too short").max(20, "Phone is too long").regex(phoneRegex, "Invalid phone number"),
  preferred_location: z.string().trim().min(2, "Select a location"),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  property_title: z.string().trim().max(300).optional().or(z.literal("")),
  property_id: z.string().trim().max(100).optional().or(z.literal("")),
});

// POST /api/enquiries
// export const createEnquiry = async (req, res, next) => {
//   try {
//     const parsed = enquirySchema.safeParse(req.body);
//     if (!parsed.success) {
//       const errors = {};
//       for (const e of parsed.error.errors) {
//         const key = e.path.join(".") || "non_field";
//         errors[key] = e.message;
//       }
//       return res.status(422).json({ ok: false, message: "Validation failed", errors });
//     }

//     const data = parsed.data;

//     const doc = await Enquiry.create({
//       ...data,
//       meta: {
//         ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
//         ua: req.headers["user-agent"] || "",
//         referer: req.headers["referer"] || "",
//       },
//     });

//     return res.status(201).json({ ok: true, message: "Thanks! We’ll contact you soon.", id: doc._id });
//   } catch (err) {
//     next(err);
//   }
// };

// POST /api/enquiries
export const createEnquiry = async (req, res, next) => {
  try {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = {};
      for (const e of parsed.error.errors) {
        const key = e.path.join(".") || "non_field";
        errors[key] = e.message;
      }
      return res
        .status(422)
        .json({ ok: false, message: "Validation failed", errors });
    }

    const data = parsed.data;

    // ✅ Check if user with this phone already exists
    const existing = await Enquiry.findOne({ phone: data.phone });
    if (existing) {
      return res
        .status(409) // conflict
        .json({ ok: false, message: "User already exists with this phone number." });
    }

    // ✅ Create new enquiry
    const doc = await Enquiry.create({
      ...data,
      meta: {
        ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip,
        ua: req.headers["user-agent"] || "",
        referer: req.headers["referer"] || "",
      },
    });

    return res
      .status(201)
      .json({ ok: true, message: "Thanks! We’ll contact you soon.", id: doc._id });
  } catch (err) {
    next(err);
  }
};

