import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, recordsTable } from "@workspace/db";
import type { Request } from "express";
import type { AuthUser } from "../middleware/requireAuth";
import { requireAdmin } from "../middleware/requireAuth";
import {
  CreateRecordBody, UpdateRecordBody, GetRecordParams,
  UpdateRecordParams, DeleteRecordParams, GetRecordResponse,
  UpdateRecordResponse, ListRecordsResponse, DeleteRecordResponse,
  GetRecordStatsResponse,
} from "@workspace/api-zod";

type AuthRequest = Request & { user: AuthUser };

const router: IRouter = Router();

function toISO(v: unknown) { return v instanceof Date ? v.toISOString() : v; }

// Stats — admin only
router.get("/records/stats", requireAdmin, async (req, res): Promise<void> => {
  const records = await db.select().from(recordsTable);
  const total = records.length;
  const resolved = records.filter((r) => r.resolved === "Yes").length;
  const unresolved = records.filter((r) => r.resolved === "No").length;
  const bonebridge = records.filter((r) => (r.implant ?? "").includes("Bone")).length;
  const soundbridge = records.filter((r) => (r.implant ?? "").includes("Sound")).length;
  res.json(GetRecordStatsResponse.parse({ total, resolved, unresolved, bonebridge, soundbridge }));
});

// My records — returns only records submitted by the logged-in staff user
router.get("/records/mine", async (req, res): Promise<void> => {
  const user = (req as unknown as AuthRequest).user;
  const records = await db
    .select()
    .from(recordsTable)
    .where(eq(recordsTable.submittedBy, user.username));
  res.json(ListRecordsResponse.parse(records.map(r => ({ ...r, createdAt: toISO(r.createdAt), firstResolvedAt: toISO(r.firstResolvedAt) }))));
});

// All records — admin only
router.get("/records", requireAdmin, async (req, res): Promise<void> => {
  const records = await db.select().from(recordsTable);
  res.json(ListRecordsResponse.parse(records.map(r => ({ ...r, createdAt: toISO(r.createdAt), firstResolvedAt: toISO(r.firstResolvedAt) }))));
});

// Create record — tag with submittedBy
router.post("/records", async (req, res): Promise<void> => {
  const user = (req as unknown as AuthRequest).user;

  const parsed = CreateRecordBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid record body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const now = new Date();
  const [record] = await db.insert(recordsTable).values({
    submittedBy: user.username,
    patientName: parsed.data.patientName ?? "",
    dob: parsed.data.dob ?? "",
    phone: parsed.data.phone ?? "",
    serial: parsed.data.serial ?? "",
    implant: parsed.data.implant ?? "",
    issueDescription: parsed.data.issueDescription ?? "",
    conditions: parsed.data.conditions ?? "",
    problemFirstOccurred: (parsed.data as any).problemFirstOccurred ?? "",
    occurrenceFrequency: (parsed.data as any).occurrenceFrequency ?? "",
    specificConditions: (parsed.data as any).specificConditions ?? "",
    skin: parsed.data.skin ?? [],
    visual: parsed.data.visual ?? [],
    audio: parsed.data.audio ?? [],
    physical: parsed.data.physical ?? [],
    accessory: parsed.data.accessory ?? [],
    connectivity: parsed.data.connectivity ?? [],
    steps: parsed.data.steps ?? [],
    resolved: parsed.data.resolved ?? "",
    resolvedHow: parsed.data.resolvedHow ?? "",
    nextAction: parsed.data.nextAction ?? "",
    contactName: parsed.data.contactName ?? "",
    contactEmail: parsed.data.contactEmail ?? "",
    firstResolvedAt: parsed.data.resolved === "Yes" ? now : null,
  }).returning();

  res.status(201).json(GetRecordResponse.parse({
    ...record,
    createdAt: toISO(record.createdAt),
    firstResolvedAt: toISO(record.firstResolvedAt),
  }));
});

router.get("/records/:id", async (req, res): Promise<void> => {
  const user = (req as unknown as AuthRequest).user;
  const params = GetRecordParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [record] = await db.select().from(recordsTable).where(eq(recordsTable.id, params.data.id));
  if (!record) { res.status(404).json({ error: "Record not found" }); return; }

  // Staff can only access their own records
  if (user.role !== "admin" && record.submittedBy !== user.username) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.json(GetRecordResponse.parse({ ...record, createdAt: toISO(record.createdAt), firstResolvedAt: toISO(record.firstResolvedAt) }));
});

router.put("/records/:id", async (req, res): Promise<void> => {
  const user = (req as unknown as AuthRequest).user;
  const params = UpdateRecordParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  // Check ownership before updating
  const [existing] = await db.select().from(recordsTable).where(eq(recordsTable.id, params.data.id));
  if (!existing) { res.status(404).json({ error: "Record not found" }); return; }
  if (user.role !== "admin" && existing.submittedBy !== user.username) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = UpdateRecordBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid record update body");
    res.status(400).json({ error: parsed.error.message }); return;
  }

  const now = new Date();
  const setFields: Record<string, unknown> = {
    patientName: parsed.data.patientName ?? "",
    dob: parsed.data.dob ?? "",
    phone: parsed.data.phone ?? "",
    serial: parsed.data.serial ?? "",
    implant: parsed.data.implant ?? "",
    issueDescription: parsed.data.issueDescription ?? "",
    conditions: parsed.data.conditions ?? "",
    problemFirstOccurred: (parsed.data as any).problemFirstOccurred ?? "",
    occurrenceFrequency: (parsed.data as any).occurrenceFrequency ?? "",
    specificConditions: (parsed.data as any).specificConditions ?? "",
    skin: parsed.data.skin ?? [],
    visual: parsed.data.visual ?? [],
    audio: parsed.data.audio ?? [],
    physical: parsed.data.physical ?? [],
    accessory: parsed.data.accessory ?? [],
    connectivity: parsed.data.connectivity ?? [],
    steps: parsed.data.steps ?? [],
    resolved: parsed.data.resolved ?? "",
    resolvedHow: parsed.data.resolvedHow ?? "",
    nextAction: parsed.data.nextAction ?? "",
    contactName: parsed.data.contactName ?? "",
    contactEmail: parsed.data.contactEmail ?? "",
  };

  // Set firstResolvedAt on resolution, clear when unresolved
  if (parsed.data.resolved === "Yes" && !existing.firstResolvedAt) {
    setFields.firstResolvedAt = now;
  } else if (parsed.data.resolved === "No") {
    setFields.firstResolvedAt = null;
  }

  const [record] = await db.update(recordsTable).set(setFields).where(eq(recordsTable.id, params.data.id)).returning();

  if (!record) { res.status(404).json({ error: "Record not found" }); return; }
  res.json(UpdateRecordResponse.parse({ ...record, createdAt: toISO(record.createdAt), firstResolvedAt: toISO(record.firstResolvedAt) }));
});

router.delete("/records/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteRecordParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [record] = await db.delete(recordsTable).where(eq(recordsTable.id, params.data.id)).returning();
  if (!record) { res.status(404).json({ error: "Record not found" }); return; }

  res.json(DeleteRecordResponse.parse({ success: true }));
});

export default router;