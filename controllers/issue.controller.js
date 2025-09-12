import { Issue } from "../models/issue.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Response } from "../utils/Response.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import PDFDocument from "pdfkit";

/* ---------------- Create new issue ---------------- */
import { uploadToCloudinary } from "../middlewares/multer.middleware.js";

export const createIssue = asyncWrapper(async (req, res) => {
  const { title, description } = req.body;
  const patientId = req.patient._id; // from patient auth middleware

  // Check if file uploaded
  if (!req.file) {
    throw new ApiError(400, "Image is required");
  }

  // Upload image to Cloudinary
  const imageUrl = await uploadToCloudinary(req.file.path);

  // Create the issue
  const issue = await Issue.create({
    patient: patientId,
    title,
    description,
    imageUrl,
  });

  res
    .status(201)
    .json(new Response(201, issue, "Issue created successfully"));
});

/* ---------------- Get all issues of logged-in patient ---------------- */
export const getMyIssues = asyncWrapper(async (req, res) => {
  const patientId = req.patient._id;

  const issues = await Issue.find({ patient: patientId })
    .populate("doctor", "fullname email")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new Response(200, { issues }, "Issues fetched successfully"));
});

/* ---------------- Get one patient-owned issue by ID ---------------- */
export const getMyIssueById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const patientId = req.patient._id;

  const issue = await Issue.findOne({ _id: id, patient: patientId })
    .populate("doctor", "fullname email");

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  res
    .status(200)
    .json(new Response(200, issue, "Issue fetched successfully"));
});

/* ---------------- Get all open issues (doctor side) ---------------- */
export const getOpenIssues = asyncWrapper(async (req, res) => {
  const issues = await Issue.find({ status: "open" })
    .populate("patient", "fullname email")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new Response(200, { issues }, "Open issues fetched successfully"));
});

/* ---------------- Get single issue (doctor side) ---------------- */
export const getIssueById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const issue = await Issue.findById(id)
    .populate("patient", "fullname email")
    .populate("doctor", "fullname email");

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  res
    .status(200)
    .json(new Response(200, issue, "Issue fetched successfully"));
});

/* ---------------- Doctor reviews issue ---------------- */
export const reviewIssue = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const doctorId = req.doctor._id; // from doctor auth middleware
  const { reviewText, treatment, precautions } = req.body;

  const issue = await Issue.findById(id);
  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  if (issue.status === "reviewed") {
    throw new ApiError(400, "Issue already reviewed");
  }

  issue.doctor = doctorId;
  issue.response = {
    text: reviewText,
    treatment,
    precautions,
    reviewedAt: new Date(),
  };
  issue.status = "reviewed";

  await issue.save();

  res
    .status(200)
    .json(new Response(200, issue, "Issue reviewed successfully"));
});


export const downloadIssueReport = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.patient._id;

    const issue = await Issue.findOne({ _id: id, patient: patientId })
      .populate("doctor", "fullname email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Init PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=issue_report_${id}.pdf`
    );
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("🩺 Patient Issue Report", { align: "center" });
    doc.moveDown();

    // Patient info
    doc.fontSize(12).text(`Patient: ${issue.patient?.fullname || "Anonymous"}`);
    doc.text(`Email: ${issue.patient?.email || "N/A"}`);
    doc.moveDown();

    // Issue info
    doc.text(`Title: ${issue.title}`);
    doc.text(`Description: ${issue.description || "-"}`);
    doc.text(`Status: ${issue.status}`);
    doc.moveDown();

    // Doctor review
    if (issue.response) {
      doc.fontSize(14).text("Doctor Review:", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`Review: ${issue.response.text || "-"}`);
      doc.text(`Treatment: ${issue.response.treatment || "-"}`);
      doc.text(`Precautions: ${issue.response.precautions || "-"}`);
      if (issue.response.reviewedAt) {
        doc.text(
          `Reviewed At: ${new Date(issue.response.reviewedAt).toLocaleString()}`
        );
      }
    } else {
      doc.fontSize(12).fillColor("red").text("⚠️ No doctor review yet.");
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
