const express = require("express");
const router = express.Router();
const {
  createDepartment, getDepartments, updateDepartment, deleteDepartment,hardDeleteDepartment
} = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(protect, getDepartments)
  .post(protect, authorize("admin"), createDepartment);

router.route("/:id")
  .put(protect, authorize("admin"), updateDepartment)
  .delete(protect, authorize("admin"), deleteDepartment);

router.delete("/:id/hard", protect, authorize("admin"), hardDeleteDepartment);
module.exports = router;