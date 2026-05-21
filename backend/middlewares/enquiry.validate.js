const { z } = require("zod");
const Enquiry = require("../models/enquiry.model");

const categoryEnumValues =
  Enquiry.schema.path("category")?.enumValues?.filter(Boolean) || [];

const buildCategorySchema = () => {
  if (categoryEnumValues.length) {
    return z.enum(categoryEnumValues).optional();
  }

  return z.string().trim().min(1).optional();
};

const enquirySchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().email().optional(),
  phone: z.string().trim().min(8),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  company: z.string().trim().optional(),
  message: z.string().trim().optional(),
  category: buildCategorySchema(),
});

const enquiryUpdateSchema = enquirySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

const bulkDeleteEnquirySchema = z.object({
  ids: z.array(z.string()).min(1, "At least one ID is required"),
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message:
        err.issues?.[0]?.message ||
        err.errors?.[0]?.message ||
        "Validation failed",
    });
  }
};

module.exports = { enquirySchema, enquiryUpdateSchema, bulkDeleteEnquirySchema, validate };
