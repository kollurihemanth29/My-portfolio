const mongoose = require("mongoose");
const Certification = require("./src/models/Certification");

async function updateServiceNow() {
  try {
    await mongoose.connect("mongodb+srv://22r21a6729:Hemanth%40123@cluster0.w5uqskb.mongodb.net/portfolio");
    console.log("Connected to MongoDB");
    
    // Remove Service Administration Professional
    const deleteResult = await Certification.deleteOne({ title: "Service Administration Professional" });
    console.log("Deleted Service Administration Professional:", deleteResult);
    
    // Add ServiceNow CSA
    const serviceNowCert = new Certification({
      title: "ServiceNow CSA",
      provider: "ServiceNow",
      issueDate: new Date("2025-05-15"),
      credentialId: "SNW-CSA-2025-HEMANTH",
      credentialUrl: "https://www.servicenow.com/services/training-and-certification/certified-system-administrator.html",
      skills: ["ITSM", "ServiceNow Platform", "Workflow Automation", "Incident Management", "Change Management", "Service Catalog"],
      description: "Automated ITSM workflows, improving operational efficiency by 30%. Certified System Administrator specializing in ServiceNow platform configuration and workflow optimization.",
      badge: "",
      status: "active",
      category: "Other",
      featured: true
    });
    
    const saved = await serviceNowCert.save();
    console.log("Added ServiceNow CSA:", saved.title);
    
    // Show all certifications
    const allCerts = await Certification.find({}).sort({ issueDate: -1 });
    console.log("\nAll certifications:");
    allCerts.forEach(cert => {
      console.log(`- ${cert.title} (${cert.provider}) - Featured: ${cert.featured} - Date: ${cert.issueDate.toISOString().split("T")[0]}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateServiceNow();
