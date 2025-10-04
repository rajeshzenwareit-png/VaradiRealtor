// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// ---------- GETs ----------
export const fetchProperties = (filters = {}) =>
  API.get("/properties", { params: filters }).then((r) => r.data);

export const fetchAgents = () => API.get("/agents").then((r) => r.data);
export const fetchBlogs  = () => API.get("/blogs").then((r) => r.data);

// Reviews
export const fetchReviews = (filters = {}) =>
  API.get("/reviews", { params: filters }).then((r) => r.data); // supports ?page, ?limit, etc.

export const fetchAllReviews = () =>
  API.get("/reviews/all").then((r) => r.data);

export const fetchReviewById = (id) =>
  API.get(`/reviews/${id}`).then((r) => r.data);

// ---------- POSTs ----------
export const postContact = (payload) =>
  API.post("/contact", payload, { headers: { "Content-Type": "application/json" } })
     .then((r) => r.data);

// (Optional) response error normalizer for forms
const normalizeError = (err) => {
  if (err?.response?.status === 422) {
    return {
      ok: false,
      errors: err.response.data?.errors || {},
      message: err.response.data?.message || "Validation failed",
    };
  }
  return {
    ok: false,
    errors: err?.response?.data?.errors || null,
    message: err?.response?.data?.message || "Something went wrong",
  };
};

// Enquiry with backend validation (Zod 422 support)
export const postEnquiry = async (payload) => {
  try {
    const { data } = await API.post("/enquiries", payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

// ---------- Reviews: create / update ----------
export const createReview = async (payload) => {
  try {
    const { data } = await API.post("/reviews", payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

export const updateReview = async (id, payload) => {
  try {
    const { data } = await API.patch(`/reviews/${id}`, payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};



// ---------- Categories ----------

export const fetchCategories = (filters = {}) =>
  API.get("/categories", { params: filters }).then((r) => r.data); 
// supports ?page, ?limit, ?name, etc.

export const fetchCategoryById = (id) =>
  API.get(`/categories/${id}`).then((r) => r.data);

export const createCategory = async (payload) => {
  try {
    const { data } = await API.post("/categories", payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

export const updateCategory = async (id, payload) => {
  try {
    // if your backend uses PATCH instead of PUT, switch to PATCH
    const { data } = await API.put(`/categories/${id}`, payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await API.delete(`/categories/${id}`);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

// (Optional) Upsert by name using the list endpoint's ?name filter
export const upsertCategoryByName = async (doc) => {
  const res = await fetchCategories({ name: doc?.name });
  const existing = Array.isArray(res?.data) ? res.data[0] : null;
  return existing
    ? updateCategory(existing._id, doc)
    : createCategory(doc);
};





// ---------- Features ----------

// GET list (supports ?active=true|false, ?q=search, ?limit, ?skip, etc.)
export const fetchFeatures = (filters = {}) =>
  API.get("/features", { params: filters }).then((r) => r.data);

// GET one by id
export const fetchFeatureById = (id) =>
  API.get(`/features/${id}`).then((r) => r.data);

// CREATE
export const createFeature = async (payload) => {
  try {
    const { data } = await API.post("/features", payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

// UPDATE (PUT; switch to PATCH if your backend prefers partial updates)
export const updateFeature = async (id, payload) => {
  try {
    const { data } = await API.put(`/features/${id}`, payload);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

// DELETE
export const deleteFeature = async (id) => {
  try {
    const { data } = await API.delete(`/features/${id}`);
    return { ok: true, data };
  } catch (err) {
    return normalizeError(err);
  }
};

// (Optional) Upsert by `text` using list endpoint's ?q filter
export const upsertFeatureByText = async (doc) => {
  const { text } = doc || {};
  if (!text) throw new Error("upsertFeatureByText: `text` is required");

  // Try find a close match via full-text search
  const results = await fetchFeatures({ q: `"${text}"`, limit: 1 });
  const existing = Array.isArray(results) ? results[0] : null;

  return existing
    ? updateFeature(existing._id, doc)
    : createFeature(doc);
};
