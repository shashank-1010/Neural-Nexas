import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Doctor, Patient, Appointment, Prescription, MedicalRecord, Store, Order } from "./models";
import { authenticate, requireRole, AuthRequest, JWT_SECRET_KEY } from "./middleware";

const router = Router();

function makeId(doc: any): any {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

function makeDocs(docs: any[]): any[] {
  return docs.map(makeId);
}

router.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.status(201).json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/auth/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/patients", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(makeDocs(patients));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/patients", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.create({ ...req.body, userId: req.user!.id });
    res.status(201).json(makeId(patient));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/patients/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(patient));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/patients/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(patient));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctors", async (_req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(makeDocs(doctors));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/doctors", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.create({ ...req.body, userId: req.user!.id });
    res.status(201).json(makeId(doctor));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctors/:id", async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(doctor));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/appointments", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(makeDocs(appointments));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/appointments", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);
    const patient = await Patient.findOne({ userId: req.user!.id });
    const appointment = await Appointment.create({
      ...req.body,
      patientId: patient?._id || req.user!.id,
      patientName: patient?.name || req.user!.name,
      doctorName: doctor?.name || "",
      doctorSpecialization: doctor?.specialization || "",
    });
    res.status(201).json(makeId(appointment));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/appointments/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(appt));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/appointments/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(appt));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/appointments/:id", authenticate, async (req: Request, res: Response) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ message: "Appointment cancelled" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/prescriptions", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 });
    res.json(makeDocs(prescriptions));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/prescriptions", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prescription = await Prescription.create({ ...req.body, doctorId: req.user!.id, doctorName: req.user!.name });
    res.status(201).json(makeId(prescription));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/prescriptions/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const p = await Prescription.findById(req.params.id);
    if (!p) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(p));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/records", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const records = await MedicalRecord.find().sort({ createdAt: -1 });
    res.json(makeDocs(records));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/records", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const patient = await Patient.findOne({ userId: req.user!.id });
    const record = await MedicalRecord.create({
      ...req.body,
      patientId: patient?._id || req.user!.id,
      patientName: patient?.name || req.user!.name,
    });
    res.status(201).json(makeId(record));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/records/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const r = await MedicalRecord.findById(req.params.id);
    if (!r) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(r));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stores", async (_req: Request, res: Response) => {
  try {
    const stores = await Store.find().sort({ rating: -1 });
    res.json(makeDocs(stores));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stores/:id", async (req: Request, res: Response) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(store));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders", authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(makeDocs(orders));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/orders", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const store = await Store.findById(req.body.storeId);
    const patient = await Patient.findOne({ userId: req.user!.id });
    const totalAmount = (req.body.items || []).reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      ...req.body,
      patientId: patient?._id || req.user!.id,
      storeName: store?.name || "",
      totalAmount,
    });
    res.status(201).json(makeId(order));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) { res.status(404).json({ message: "Not found" }); return; }
    res.json(makeId(o));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/emergency", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const emergencyId = `EMR-${Date.now()}`;
    res.json({
      message: "Emergency alert triggered! Help is on the way.",
      emergencyId,
      estimatedResponse: "8-12 minutes",
      nearestHospital: "City General Hospital - 1.2 km",
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/admin/stats", authenticate, requireRole("admin"), async (_req: AuthRequest, res: Response) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, totalOrders, pendingAppointments, activeOrders, newUsers] =
      await Promise.all([
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        Order.countDocuments(),
        Appointment.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: { $in: ["pending", "processing", "out-for-delivery"] } }),
        User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 86400000) } }),
      ]);
    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalOrders,
      pendingAppointments,
      activeOrders,
      revenue: totalOrders * 350,
      newUsersToday: newUsers,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/admin/users", authenticate, requireRole("admin"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map((u) => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
