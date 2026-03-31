import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({ name: String, email: { type: String, unique: true, lowercase: true }, password: String, role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" } }, { timestamps: true });
export const User = mongoose.model("User", UserSchema);

const DoctorSchema = new Schema({ userId: Schema.Types.ObjectId, name: String, specialization: String, qualification: String, experience: Number, phone: String, hospital: String, consultationFee: Number, rating: { type: Number, default: 4.5 }, isVerified: { type: Boolean, default: false }, availableSlots: [String] }, { timestamps: true });
export const Doctor = mongoose.model("Doctor", DoctorSchema);

const PatientSchema = new Schema({ userId: Schema.Types.ObjectId, name: String, dateOfBirth: String, gender: String, bloodGroup: String, phone: String, address: String, allergies: [String], chronicConditions: [String], emergencyContact: String }, { timestamps: true });
export const Patient = mongoose.model("Patient", PatientSchema);

const AppointmentSchema = new Schema({ patientId: Schema.Types.ObjectId, doctorId: Schema.Types.ObjectId, patientName: String, doctorName: String, doctorSpecialization: String, date: String, time: String, type: { type: String, enum: ["in-person", "online", "zero-wait"], default: "in-person" }, status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" }, notes: String }, { timestamps: true });
export const Appointment = mongoose.model("Appointment", AppointmentSchema);

const PrescriptionSchema = new Schema({ patientId: Schema.Types.ObjectId, doctorId: Schema.Types.ObjectId, patientName: String, doctorName: String, medications: [{ name: String, dosage: String, frequency: String, duration: String }], diagnosis: String, notes: String, validUntil: String }, { timestamps: true });
export const Prescription = mongoose.model("Prescription", PrescriptionSchema);

const MedicalRecordSchema = new Schema({ patientId: Schema.Types.ObjectId, doctorId: Schema.Types.ObjectId, patientName: String, type: { type: String, enum: ["lab-report", "imaging", "discharge-summary", "consultation", "vaccination", "other"], default: "other" }, title: String, description: String, fileUrl: String, date: String }, { timestamps: true });
export const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

const StoreSchema = new Schema({ name: String, type: { type: String, enum: ["hospital", "pharmacy", "clinic", "diagnostic-center"] }, address: String, phone: String, rating: Number, distance: String, isOpen: Boolean, openHours: String, services: [String] }, { timestamps: true });
export const Store = mongoose.model("Store", StoreSchema);

const OrderSchema = new Schema({ patientId: Schema.Types.ObjectId, storeId: Schema.Types.ObjectId, storeName: String, items: [{ medicineName: String, quantity: Number, price: Number }], totalAmount: Number, status: { type: String, enum: ["pending", "processing", "out-for-delivery", "delivered", "cancelled"], default: "pending" }, deliveryAddress: String }, { timestamps: true });
export const Order = mongoose.model("Order", OrderSchema);
