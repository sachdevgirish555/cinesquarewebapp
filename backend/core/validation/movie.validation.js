const { z } = require("zod");

const movieSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),

  rating: z.enum(["U", "U/A 7+", "U/A 13+", "U/A 16+", "A"]),

  language: z.string().min(2, "Language is required"),

  // ✅ Works for both comma string & array (form-data safe)
  genres: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string") return val.split(",").map((item) => item.trim()).filter(Boolean);
    return [];
  }, z.array(z.string()).min(1, "At least one genre required")),

  year: z
    .string()
    .trim()
    .regex(/^\d{4}(-\d{2}-\d{2})?$/, "Year must be in YYYY or YYYY-MM-DD format"),

  newRelease: z.coerce.boolean().optional(),

  trailer: z.string().url("Invalid trailer URL"),
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: (err.issues || []).map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }
};

module.exports = { movieSchema, validate };
