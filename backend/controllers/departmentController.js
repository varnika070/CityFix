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