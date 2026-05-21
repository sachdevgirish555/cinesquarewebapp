const Enquiry = require("../models/enquiry.model");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_ORDER = "desc";

const SEARCHABLE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "state",
  "jobTitle",
  "company",
  "message",
  "category",
];

const SORTABLE_FIELDS = [
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "email",
  "phone",
  "city",
  "state",
  "company",
  "category",
];

const getCategoryEnumValues = () => {
  return Enquiry.schema.path("category")?.enumValues?.filter(Boolean) || [];
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

exports.createEnquiry = async (data) => {
  return await Enquiry.create(data);
};

exports.getAllEnquiries = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const parsedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(parsedLimit, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const search = query.search?.trim() || "";
  const category = query.category?.trim() || "";
  const sortBy = SORTABLE_FIELDS.includes(query.sortBy)
    ? query.sortBy
    : DEFAULT_SORT_BY;
  const sortOrder = query.sortOrder === "asc" ? "asc" : DEFAULT_SORT_ORDER;
  const categoryEnumValues = getCategoryEnumValues();

  if (category && categoryEnumValues.length) {
    const matchesEnum = categoryEnumValues.some(
      (value) => value.toLowerCase() === category.toLowerCase()
    );

    if (!matchesEnum) {
      const error = new Error(
        `Invalid category filter. Allowed values: ${categoryEnumValues.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const filters = {};

  if (search) {
    filters.$or = SEARCHABLE_FIELDS.map((field) => ({
      [field]: { $regex: escapeRegex(search), $options: "i" },
    }));
  }

  if (category) {
    filters.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
  }

  const [data, total] = await Promise.all([
    Enquiry.find(filters)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Enquiry.countDocuments(filters),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: {
      search: search || null,
      category: category || null,
      sortBy,
      sortOrder,
      availableCategories: categoryEnumValues,
    },
  };
};

exports.getEnquiryById = async (id) => {
  return await Enquiry.findById(id);
};

exports.updateEnquiry = async (id, data) => {
  return await Enquiry.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteEnquiry = async (id) => {
  return await Enquiry.findByIdAndDelete(id);
};

exports.bulkDeleteEnquiries = async (ids) => {
  return await Enquiry.deleteMany({ _id: { $in: ids } });
};

exports.getEnquiriesByCategory = async (category) => {
  return await Enquiry.find({
    category: { $regex: `^${escapeRegex(category)}$`, $options: "i" },
  }).sort({ createdAt: -1 });
};
