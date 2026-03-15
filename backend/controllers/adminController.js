const User = require("../models/user");
const Complaint = require("../models/complaint");

// Dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalComplaints, pending, assigned, inProgress,
      resolved, rejected, totalUsers, totalStaff,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "pending" }),
      Complaint.countDocuments({ status: "assigned" }),
      Complaint.countDocuments({ status: "in-progress" }),
      Complaint.countDocuments({ status: "resolved" }),
      Complaint.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "citizen" }),
      User.countDocuments({ role: "staff" }),
    ]);

    const categoryStats = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: { totalComplaints, pending, assigned, inProgress, resolved, rejected, totalUsers, totalStaff },
      categoryStats,
    });
  } catch (err) { next(err); }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// Toggle user active status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}` });
  } catch (err) { next(err); }
};