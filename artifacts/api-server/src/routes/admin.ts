import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, conversationsTable, transactionsTable, chargeRequestsTable } from "@workspace/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { requireAdmin, requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { AdminChargeUserBody } from "@workspace/api-zod";

const router: IRouter = Router();

function validateChargeRequest(body: unknown): { package_name: string; amount: number; note?: string } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b["package_name"] !== "string" || !b["package_name"]) return null;
  if (typeof b["amount"] !== "number" || b["amount"] <= 0 || !Number.isInteger(b["amount"])) return null;
  return { package_name: b["package_name"], amount: b["amount"], note: typeof b["note"] === "string" ? b["note"] : undefined };
}

router.get("/admin/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      phone: usersTable.phone,
      balance: usersTable.balance,
      role: usersTable.role,
      created_at: usersTable.created_at,
    }).from(usersTable).orderBy(usersTable.created_at);

    res.json({ users: users.map(u => ({ ...u, created_at: u.created_at.toISOString() })) });
  } catch (err) {
    req.log.error({ err }, "Admin get users error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/stats", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [userStats] = await db.select({
      total_users: sql<number>`count(*)::int`,
      total_balance: sql<number>`coalesce(sum(balance), 0)`,
    }).from(usersTable);

    const [convStats] = await db.select({
      total_conversations: sql<number>`count(*)::int`,
    }).from(conversationsTable);

    const [txStats] = await db.select({
      total_transactions: sql<number>`count(*)::int`,
    }).from(transactionsTable);

    const [pendingStats] = await db.select({
      pending_requests: sql<number>`count(*)::int`,
    }).from(chargeRequestsTable).where(eq(chargeRequestsTable.status, "pending"));

    res.json({
      total_users: userStats?.total_users ?? 0,
      total_balance: userStats?.total_balance ?? 0,
      total_conversations: convStats?.total_conversations ?? 0,
      total_transactions: txStats?.total_transactions ?? 0,
      pending_requests: pendingStats?.pending_requests ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Admin get stats error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/admin/charge", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const parsed = AdminChargeUserBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "بيانات غير صحيحة" }); return; }
    const { user_id, amount } = parsed.data;

    const users = await db.select().from(usersTable).where(eq(usersTable.id, user_id)).limit(1);
    if (users.length === 0) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    const user = users[0];
    const newBalance = user.balance + amount;

    await db.update(usersTable).set({ balance: newBalance }).where(eq(usersTable.id, user_id));
    await db.insert(transactionsTable).values({ user_id, amount, type: "charge", status: "completed" });

    res.json({ success: true, new_balance: newBalance, message: `تم شحن ${amount} نقطة للمستخدم ${user.name}` });
  } catch (err) {
    req.log.error({ err }, "Admin charge error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.get("/admin/charge-requests", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const requests = await db.select().from(chargeRequestsTable).orderBy(desc(chargeRequestsTable.created_at));
    res.json({
      requests: requests.map(r => ({
        ...r,
        created_at: r.created_at.toISOString(),
        updated_at: r.updated_at.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Admin get charge requests error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/admin/charge-requests/:id/approve", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const requestId = Number(req.params["id"]);
    if (isNaN(requestId)) { res.status(400).json({ error: "معرف غير صحيح" }); return; }

    const requests = await db.select().from(chargeRequestsTable).where(eq(chargeRequestsTable.id, requestId)).limit(1);
    if (requests.length === 0) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
    const request = requests[0];
    if (request.status !== "pending") { res.status(400).json({ error: "هذا الطلب تمت معالجته مسبقاً" }); return; }

    const users = await db.select().from(usersTable).where(eq(usersTable.id, request.user_id)).limit(1);
    if (users.length === 0) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    const user = users[0];
    const newBalance = user.balance + request.amount;

    await db.update(usersTable).set({ balance: newBalance }).where(eq(usersTable.id, request.user_id));
    await db.insert(transactionsTable).values({ user_id: request.user_id, amount: request.amount, type: "charge", status: "completed" });
    await db.update(chargeRequestsTable)
      .set({ status: "approved", updated_at: new Date() })
      .where(eq(chargeRequestsTable.id, requestId));

    res.json({ success: true, new_balance: newBalance, message: `تم قبول طلب شحن ${request.amount} نقطة للمستخدم ${user.name}` });
  } catch (err) {
    req.log.error({ err }, "Admin approve charge request error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/admin/charge-requests/:id/reject", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const requestId = Number(req.params["id"]);
    if (isNaN(requestId)) { res.status(400).json({ error: "معرف غير صحيح" }); return; }

    const requests = await db.select().from(chargeRequestsTable).where(eq(chargeRequestsTable.id, requestId)).limit(1);
    if (requests.length === 0) { res.status(404).json({ error: "الطلب غير موجود" }); return; }
    if (requests[0].status !== "pending") { res.status(400).json({ error: "هذا الطلب تمت معالجته مسبقاً" }); return; }

    await db.update(chargeRequestsTable)
      .set({ status: "rejected", updated_at: new Date() })
      .where(eq(chargeRequestsTable.id, requestId));

    res.json({ success: true, message: "تم رفض الطلب" });
  } catch (err) {
    req.log.error({ err }, "Admin reject charge request error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/charge-request", requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = validateChargeRequest(req.body);
    if (!parsed) { res.status(400).json({ error: "بيانات غير صحيحة" }); return; }
    const { package_name, amount, note } = parsed;

    const users = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (users.length === 0) { res.status(404).json({ error: "المستخدم غير موجود" }); return; }
    const user = users[0];

    const [newRequest] = await db.insert(chargeRequestsTable).values({
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone,
      package_name,
      amount,
      note: note ?? null,
      status: "pending",
    }).returning();

    res.json({ success: true, request_id: newRequest.id, message: "تم إرسال طلب الشحن بنجاح" });
  } catch (err) {
    req.log.error({ err }, "Create charge request error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
