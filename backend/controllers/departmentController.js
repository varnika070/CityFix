const Department = require("../models/department");

exports.createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, dept });
  } catch (err) { next(err); }
};

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).populate("head", "name email");
    res.json({ success: true, departments });
  } catch (err) { next(err); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json({ success: true, dept });
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Department deactivated" });
  } catch (err) { next(err); }
};

// Soft delete — marks as inactive, keeps data
exports.deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    // Check if department has active complaints
    const activeComplaints = await Complaint.countDocuments({
      department: req.params.id,
      status: { $in: ["assigned", "in-progress"] }
    });

    if (activeComplaints > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot deactivate — ${activeComplaints} active complaint(s) assigned to this department`
      });
    }

    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Department deactivated successfully" });
  } catch (err) { next(err); }
};

// Hard delete — permanently removes department (use with caution)
exports.hardDeleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });

    // Unassign complaints from this department before deleting
    await Complaint.updateMany(
      { department: req.params.id },
      { $unset: { department: "", assignedTo: "" }, status: "pending" }
    );

    await dept.deleteOne();
    res.json({ success: true, message: "Department permanently deleted, complaints moved back to pending" });
  } catch (err) { next(err); }
};