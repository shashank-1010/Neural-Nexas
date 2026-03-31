import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Doctor, Patient, Appointment, Prescription, MedicalRecord, Store, Order } from "./models";
import { authenticate, requireRole, AuthRequest, JWT_SECRET } from "./middleware";

const router = Router();

function fmt(doc: any) {
  if (!doc) return doc;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  o.id = o._id?.toString();
  delete o._id; delete o.__v;
  return o;
}
const fmtAll = (docs: any[]) => docs.map(fmt);

router.get("/healthz", (_req, res) => res.json({ status: "ok" }));

// Auth
router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) { res.status(400).json({ message: "All fields required" }); return; }
    if (await User.findOne({ email })) { res.status(400).json({ message: "Email already registered" }); return; }
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: (user as any).createdAt } });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password as string))) { res.status(401).json({ message: "Invalid credentials" }); return; }
    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: (user as any).createdAt } });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.get("/auth/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) { res.status(404).json({ message: "Not found" }); return; }
    res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: (user as any).createdAt });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

// Patients
router.get("/patients", authenticate, async (_req, res) => { try { res.json(fmtAll(await Patient.find().sort({ createdAt: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/patients", authenticate, async (req: AuthRequest, res) => { try { res.status(201).json(fmt(await Patient.create({ ...req.body, userId: req.user!.id }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.get("/patients/:id", authenticate, async (req, res) => { try { const p = await Patient.findById(req.params.id); if (!p) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(p)); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.put("/patients/:id", authenticate, async (req, res) => { try { const p = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!p) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(p)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Doctors
router.get("/doctors", async (_req, res) => { try { res.json(fmtAll(await Doctor.find().sort({ rating: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/doctors", authenticate, async (req: AuthRequest, res) => { try { res.status(201).json(fmt(await Doctor.create({ ...req.body, userId: req.user!.id }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.get("/doctors/:id", async (req, res) => { try { const d = await Doctor.findById(req.params.id); if (!d) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(d)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Appointments
router.get("/appointments", authenticate, async (_req, res) => { try { res.json(fmtAll(await Appointment.find().sort({ createdAt: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/appointments", authenticate, async (req: AuthRequest, res) => {
  try {
    const [doctor, patient] = await Promise.all([Doctor.findById(req.body.doctorId), Patient.findOne({ userId: req.user!.id })]);
    const appt = await Appointment.create({ ...req.body, patientId: patient?._id || req.user!.id, patientName: patient?.name || req.user!.name, doctorName: (doctor as any)?.name || "", doctorSpecialization: (doctor as any)?.specialization || "" });
    res.status(201).json(fmt(appt));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});
router.get("/appointments/:id", authenticate, async (req, res) => { try { const a = await Appointment.findById(req.params.id); if (!a) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(a)); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.put("/appointments/:id", authenticate, async (req, res) => { try { const a = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!a) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(a)); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.delete("/appointments/:id", authenticate, async (req, res) => { try { await Appointment.findByIdAndUpdate(req.params.id, { status: "cancelled" }); res.json({ message: "Cancelled" }); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Prescriptions
router.get("/prescriptions", authenticate, async (_req, res) => { try { res.json(fmtAll(await Prescription.find().sort({ createdAt: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/prescriptions", authenticate, async (req: AuthRequest, res) => { try { res.status(201).json(fmt(await Prescription.create({ ...req.body, doctorId: req.user!.id, doctorName: req.user!.name }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.get("/prescriptions/:id", authenticate, async (req, res) => { try { const p = await Prescription.findById(req.params.id); if (!p) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(p)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Medical Records
router.get("/records", authenticate, async (_req, res) => { try { res.json(fmtAll(await MedicalRecord.find().sort({ createdAt: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/records", authenticate, async (req: AuthRequest, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user!.id });
    res.status(201).json(fmt(await MedicalRecord.create({ ...req.body, patientId: patient?._id || req.user!.id, patientName: (patient as any)?.name || req.user!.name })));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});
router.get("/records/:id", authenticate, async (req, res) => { try { const r = await MedicalRecord.findById(req.params.id); if (!r) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(r)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Stores
router.get("/stores", async (_req, res) => { try { res.json(fmtAll(await Store.find().sort({ rating: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.get("/stores/:id", async (req, res) => { try { const s = await Store.findById(req.params.id); if (!s) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(s)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Orders
router.get("/orders", authenticate, async (_req, res) => { try { res.json(fmtAll(await Order.find().sort({ createdAt: -1 }))); } catch (e: any) { res.status(500).json({ message: e.message }); } });
router.post("/orders", authenticate, async (req: AuthRequest, res) => {
  try {
    const [store, patient] = await Promise.all([Store.findById(req.body.storeId), Patient.findOne({ userId: req.user!.id })]);
    const totalAmount = (req.body.items || []).reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    res.status(201).json(fmt(await Order.create({ ...req.body, patientId: patient?._id || req.user!.id, storeName: (store as any)?.name || "", totalAmount })));
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});
router.get("/orders/:id", authenticate, async (req, res) => { try { const o = await Order.findById(req.params.id); if (!o) { res.status(404).json({ message: "Not found" }); return; } res.json(fmt(o)); } catch (e: any) { res.status(500).json({ message: e.message }); } });

// Emergency
router.post("/emergency", authenticate, async (_req, res) => {
  res.json({ message: "Emergency alert triggered! Help is on the way.", emergencyId: `EMR-${Date.now()}`, estimatedResponse: "8-12 minutes", nearestHospital: "Apollo Hospital — 2.1 km" });
});

// Admin
router.get("/admin/stats", authenticate, requireRole("admin"), async (_req, res) => {
  try {
    const [tp, td, ta, to, pa, ao, nu] = await Promise.all([Patient.countDocuments(), Doctor.countDocuments(), Appointment.countDocuments(), Order.countDocuments(), Appointment.countDocuments({ status: "pending" }), Order.countDocuments({ status: { $in: ["pending", "processing", "out-for-delivery"] } }), User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 86400000) } })]);
    res.json({ totalPatients: tp, totalDoctors: td, totalAppointments: ta, totalOrders: to, pendingAppointments: pa, activeOrders: ao, revenue: to * 350, newUsersToday: nu });
  } catch (e: any) { res.status(500).json({ message: e.message }); }
});

router.get("/admin/users", authenticate, requireRole("admin"), async (_req, res) => {
  try { res.json((await User.find().select("-password").sort({ createdAt: -1 })).map((u: any) => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }))); }
  catch (e: any) { res.status(500).json({ message: e.message }); }
});

export default router;
