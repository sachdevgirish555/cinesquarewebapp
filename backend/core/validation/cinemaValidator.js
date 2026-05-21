const { z } = require("zod");

const cinemaSchema = z.object({
  city: z.string().min(2, "City is required"),

  name: z.string().min(2, "Name is required"),

  address: z.string().min(5, "Address is required"),

  // ✅ Works for form-data (multiple phone fields OR comma string)
  phone: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return val.split(",");
    return [];
  }, z.array(z.string().min(5, "Invalid phone number")).min(1, "At least one phone number required")),

  // ✅ Social comes as JSON string in form-data
  social: z.preprocess((val) => {
    if (!val) return [];
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val;
  },
    z.array(
      z.object({
        icon: z.string().min(1, "Icon is required"),
        link: z.string().optional(),
      })
    ).optional()
  ),
});


// ✅ Validation Middleware
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }
};

module.exports = { cinemaSchema, validate };