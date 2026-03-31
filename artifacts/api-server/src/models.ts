import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  phone: string;
  hospital: string;
  consultationFee: number;
  rating: number;
  isVerified: boolean;
  availableSlots: string[];
  createdAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    qualification: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    phone: { type: String, default: "" },
    hospital: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    isVerified: { type: Boolean, default: false },
    availableSlots: { type: [String], default: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    allergies: { type: [String], default: [] },
    chronicConditions: { type: [String], default: [] },
    emergencyContact: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  type: "in-person" | "online" | "zero-wait";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientName: { type: String, default: "" },
    doctorName: { type: String, default: "" },
    doctorSpecialization: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ["in-person", "online", "zero-wait"], default: "in-person" },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  doctorName: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  diagnosis: string;
  notes: string;
  validUntil: string;
  createdAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    patientName: { type: String, default: "" },
    doctorName: { type: String, default: "" },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, default: "7 days" },
      },
    ],
    diagnosis: { type: String, default: "" },
    notes: { type: String, default: "" },
    validUntil: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescription>("Prescription", PrescriptionSchema);

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  type: "lab-report" | "imaging" | "discharge-summary" | "consultation" | "vaccination" | "other";
  title: string;
  description: string;
  fileUrl: string;
  date: string;
  createdAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    patientName: { type: String, default: "" },
    type: {
      type: String,
      enum: ["lab-report", "imaging", "discharge-summary", "consultation", "vaccination", "other"],
      default: "other",
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);

export interface IStore extends Document {
  name: string;
  type: "hospital" | "pharmacy" | "clinic" | "diagnostic-center";
  address: string;
  phone: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  openHours: string;
  services: string[];
  createdAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["hospital", "pharmacy", "clinic", "diagnostic-center"], default: "pharmacy" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    rating: { type: Number, default: 4.0 },
    distance: { type: String, default: "1.0 km" },
    isOpen: { type: Boolean, default: true },
    openHours: { type: String, default: "8:00 AM - 10:00 PM" },
    services: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Store = mongoose.model<IStore>("Store", StoreSchema);

export interface IOrder extends Document {
  patientId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  storeName: string;
  items: { medicineName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "out-for-delivery" | "delivered" | "cancelled";
  deliveryAddress: string;
  prescriptionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    storeName: { type: String, default: "" },
    items: [
      {
        medicineName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: { type: String, required: true },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription" },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
