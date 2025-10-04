import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferred_location: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: "", maxlength: 2000 },
    property_title: { type: String, trim: true, default: "" },
    property_id: { type: String, trim: true, default: "" },
    meta: { ip: String, ua: String, referer: String }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", EnquirySchema);
