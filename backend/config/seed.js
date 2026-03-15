require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Department = require("../models/department");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Create Admin
    const existingAdmin = await User.findOne({ email: "admin@municipal.gov.in" });
    if (!existingAdmin) {
      await User.create({
        name: "Super Admin",
        email: "admin@municipal.gov.in",
        password: "Admin@12345",
        phone: "9000000000",
        role: "admin",
      });
      console.log("✅ Admin user created");
    } else {
      console.log("⚠️  Admin already exists");
    }

    // Create Departments
    const departments = [
      { name: "Roads & Infrastructure",  contactEmail: "roads@municipal.gov.in" },
      { name: "Water Supply",            contactEmail: "water@municipal.gov.in" },
      { name: "Electricity",             contactEmail: "electricity@municipal.gov.in" },
      { name: "Sanitation & Drainage",   contactEmail: "sanitation@municipal.gov.in" },
      { name: "Street Lights & Parks",   contactEmail: "parks@municipal.gov.in" },
    ];

    for (const dept of departments) {
      const exists = await Department.findOne({ name: dept.name });
      if (!exists) {
        await Department.create(dept);
        console.log(`✅ Department created: ${dept.name}`);
      }
    }

    console.log("\n🎉 Seeding complete!");
    console.log("Admin Email:    admin@municipal.gov.in");
    console.log("Admin Password: Admin@12345");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();