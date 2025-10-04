// server/controllers/contactController.js
export const handleContactForm = async (req, res) => {
  try {
    // TODO: save to DB / send email. For now just log it.
    console.log("Contact form:", req.body);
    res.status(200).json({ ok: true, message: "Form submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
