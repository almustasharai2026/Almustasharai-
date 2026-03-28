import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, conversationsTable, transactionsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAdmin, type AuthRequest } from "../middlewares/auth.js";
import { AdminChargeUserBody } from "@workspace/api-zod";

const router: IRouter = Router();

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

    res.json({
      users: users.map(u => ({ ...u, created_at: u.created_at.toISOString() })),
    });
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

    res.json({
      total_users: userStats?.total_users ?? 0,
      total_balance: userStats?.total_balance ?? 0,
      total_conversations: convStats?.total_conversations ?? 0,
      total_transactions: txStats?.total_transactions ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Admin get stats error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

router.post("/admin/charge", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const parsed = AdminChargeUserBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "بيانات غير صحيحة" });
      return;
    }
    const { user_id, amount } = parsed.data;

    const users = await db.select().from(usersTable).where(eq(usersTable.id, user_id)).limit(1);
    if (users.length === 0) {
      res.status(404).json({ error: "المستخدم غير موجود" });
      return;
    }
    const user = users[0];
    const newBalance = user.balance + amount;

    await db.update(usersTable).set({ balance: newBalance }).where(eq(usersTable.id, user_id));
    await db.insert(transactionsTable).values({
      user_id,
      amount,
      type: "charge",
      status: "completed",
    });

    res.json({
      success: true,
      new_balance: newBalance,
      message: `تم شحن ${amount} نقطة للمستخدم ${user.name}`,
    });
  } catch (err) {
    req.log.error({ err }, "Admin charge error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
