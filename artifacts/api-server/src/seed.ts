import bcrypt from "bcryptjs";
import { User, Doctor, Store } from "./models";
import { logger } from "./lib/logger";

export async function seedData(): Promise<void> {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount > 0) return;

    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@neuralnexas.com" },
      { name: "Admin", email: "admin@neuralnexas.com", password: adminPassword, role: "admin" },
      { upsert: true, new: true }
    );
    logger.info({ id: adminUser._id }, "Admin user seeded");

    const doctorData = [
      { name: "Dr. Sarah Johnson", specialization: "Cardiology", qualification: "MBBS, MD", experience: 12, hospital: "City Heart Hospital", consultationFee: 800, rating: 4.8, isVerified: true },
      { name: "Dr. Rajesh Kumar", specialization: "Neurology", qualification: "MBBS, DM", experience: 15, hospital: "NeuroCore Medical Center", consultationFee: 1200, rating: 4.9, isVerified: true },
      { name: "Dr. Priya Sharma", specialization: "Pediatrics", qualification: "MBBS, DCH", experience: 8, hospital: "Child Care Hospital", consultationFee: 600, rating: 4.7, isVerified: true },
      { name: "Dr. Anil Mehta", specialization: "Orthopedics", qualification: "MBBS, MS", experience: 20, hospital: "Bone & Joint Institute", consultationFee: 900, rating: 4.6, isVerified: true },
      { name: "Dr. Meena Patel", specialization: "Dermatology", qualification: "MBBS, DVD", experience: 10, hospital: "Skin Wellness Clinic", consultationFee: 700, rating: 4.5, isVerified: true },
    ];

    for (const d of doctorData) {
      await Doctor.create({ ...d, availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] });
    }
    logger.info("Doctors seeded");

    const storeData = [
      { name: "MedPlus Pharmacy", type: "pharmacy", address: "12 Health Street, MG Road", phone: "080-41234567", rating: 4.7, distance: "0.8 km", isOpen: true, openHours: "7:00 AM - 11:00 PM", services: ["Medicines", "Health Products", "Lab Tests"] },
      { name: "Apollo Hospital", type: "hospital", address: "45 Apollo Road, Jayanagar", phone: "080-26688888", rating: 4.9, distance: "2.1 km", isOpen: true, openHours: "24 Hours", services: ["Emergency", "Surgery", "ICU", "OPD"] },
      { name: "LifeCare Clinic", type: "clinic", address: "8 Wellness Lane, Koramangala", phone: "080-25435678", rating: 4.5, distance: "1.3 km", isOpen: true, openHours: "8:00 AM - 8:00 PM", services: ["General Consultation", "Vaccination"] },
      { name: "Fortis Diagnostic Center", type: "diagnostic-center", address: "22 Lab Road, Indiranagar", phone: "080-35678901", rating: 4.6, distance: "3.0 km", isOpen: true, openHours: "6:00 AM - 9:00 PM", services: ["Blood Tests", "MRI", "CT Scan", "X-Ray"] },
      { name: "Wellness Pharmacy", type: "pharmacy", address: "5 Green Park, HSR Layout", phone: "080-47654321", rating: 4.4, distance: "1.5 km", isOpen: false, openHours: "9:00 AM - 9:00 PM", services: ["Medicines", "Baby Care", "First Aid"] },
    ];

    for (const s of storeData) {
      await Store.create(s);
    }
    logger.info("Stores seeded");
  } catch (err) {
    logger.error({ err }, "Seed error");
  }
}
