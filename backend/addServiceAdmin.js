const mongoose = require("mongoose");
const Certification = require("./src/models/Certification");

async function addServiceAdmin() {
  try {
    await mongoose.connect("mongodb+srv://22r21a6729:Hemanth%40123@cluster0.w5uqskb.mongodb.net/portfolio");
    console.log("Connected to MongoDB");
    
    const serviceAdminCert = new Certification({
      title: "Service Administration Professional",
      provider: "Microsoft", 
      issueDate: new Date("2024-06-15"),
      credentialId: "MSA-2024-HEMANTH",
      credentialUrl: "https://learn.microsoft.com/en-us/certifications/azure-administrator/",
      skills: ["Windows Server", "Active Directory", "Group Policy", "DNS", "DHCP", "System Administration"],
      description: "Comprehensive certification in Windows Server administration, Active Directory management, and enterprise service deployment.",
      badge: "",
      status: "active", 
      category: "Other",
      featured: true
    });
    
    const saved = await serviceAdminCert.save();
    console.log("Added Service Administration cert:", saved.title);
    
    const allCerts = await Certification.find({});
    console.log("\nAll certifications:");
    allCerts.forEach(cert => {
      console.log(`- ${cert.title} (featured: ${cert.featured})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

addServiceAdmin();
