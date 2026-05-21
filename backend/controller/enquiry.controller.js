const service = require("../services/enquiry.service");
const nodemailer = require("nodemailer");
const EmailConfig = require("../models/emailConfig.model");
require("dotenv").config();

const getEmailCredentials = async () => {
  const config = await EmailConfig.findOne().sort({ updatedAt: -1 }).lean();
  return {
    emailUser: config?.emailUser || process.env.EMAIL_USER,
    emailPass: config?.emailPass || process.env.EMAIL_PASS,
  };
};

const createTransporter = ({ emailUser, emailPass }) => {
  if (!emailUser || !emailPass) {
    throw new Error("Missing sender email configuration");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const sendEnquiryEmail = async (data) => {
  try {
    const { emailUser, emailPass } = await getEmailCredentials();
    const transporter = createTransporter({ emailUser, emailPass });
    const { firstName, lastName, email, phone, category, message } = data;
    const fullName = `${firstName} ${lastName}`;

    // Admin Email
    await transporter.sendMail({
      from: `"CineSquare" <${emailUser}>`,
      to: "info@cinesquare.in",
      subject: `New Enquiry: ${category || "General"}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email || "N/A"}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Category:</strong> ${category || "N/A"}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    // Auto Reply
    if (email) {
      await transporter.sendMail({
        from: `"CineSquare" <${emailUser}>`,
        to: email,
        subject: "We received your enquiry",
        html: `
          <h3>Hi ${fullName},</h3>
          <p>Thank you for contacting CineSquare. Our team will get back to you shortly.</p>
          <br/>
          <p>Regards,<br/>Team CineSquare</p>
        `,
      });
    }

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

exports.getEmailConfig = async (req, res, next) => {
  try {
    const config = await EmailConfig.findOne().sort({ updatedAt: -1 }).lean();
    const emailUser = config?.emailUser || process.env.EMAIL_USER || "";
    const emailPass = config?.emailPass || process.env.EMAIL_PASS || "";

    return res.json({
      success: true,
      data: {
        emailUser,
        emailPass,
        emailPassConfigured: Boolean(emailPass),
        source: config ? "database" : "environment",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEmailConfig = async (req, res, next) => {
  try {
    const { emailUser, emailPass } = req.body;

    if (!emailUser || !emailPass) {
      return res.status(400).json({
        success: false,
        message: "emailUser and emailPass are required",
      });
    }

    const saved = await EmailConfig.findOneAndUpdate(
      {},
      { emailUser, emailPass },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({
      success: true,
      message: "Email settings updated successfully",
      data: {
        id: saved._id,
        emailUser: saved.emailUser,
        emailPassConfigured: true,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const enquiry = await service.createEnquiry(req.body);

    const emailSent = await sendEnquiryEmail(req.body);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      emailSent,
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const result = await service.getAllEnquiries(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await service.getEnquiryById(req.params.id);
    if (!data)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await service.updateEnquiry(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await service.deleteEnquiry(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.bulkRemove = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await service.bulkDeleteEnquiries(ids);

    res.json({
      success: true,
      message: "Enquiries deleted successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const result = await service.getAllEnquiries({
      ...req.query,
      category: req.params.category,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};
