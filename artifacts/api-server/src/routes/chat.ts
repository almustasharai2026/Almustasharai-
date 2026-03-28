import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, conversationsTable, transactionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { SendMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const PERSONAS: Record<string, string> = {
  "محامي الدفاع": "أنت محامي دفاع متخصص في القانون المصري. تقدم استشارات قانونية للمتهمين وتساعد في بناء استراتيجية الدفاع.",
  "المحلل القانوني": "أنت محلل قانوني متخصص في تحليل النصوص القانونية والأحكام القضائية وتقديم تفسيرات دقيقة.",
  "رؤية القاضي": "أنت تقدم وجهة نظر القاضي وكيف ينظر القضاة إلى القضايا والأدلة والحجج القانونية.",
  "استشارة سريعة": "أنت مستشار قانوني سريع تقدم إجابات موجزة ومباشرة للأسئلة القانونية اليومية.",
  "المختار الذكي": "أنت متخصص في القانون الإداري والمعاملات الحكومية وتساعد المواطنين في التعامل مع الإجراءات البيروقراطية.",
  "دكتور القانون": "أنت أستاذ جامعي في القانون تشرح المفاهيم والمبادئ القانونية بطريقة أكاديمية.",
};

async function getAIReply(persona: string, message: string, conversationHistory: { role: string; content: string }[]): Promise<string> {
  const OPENAI_KEY = process.env["OPENAI_API_KEY"];
  const systemPrompt = PERSONAS[persona] ?? "أنت مساعد قانوني متخصص في القانون المصري.";

  if (!OPENAI_KEY) {
    return `شكراً على سؤالك. بصفتي ${persona}، يمكنني إخبارك أن هذا سؤال قانوني مهم يتعلق بـ: "${message}". للحصول على إجابة دقيقة، يرجى استشارة محامٍ متخصص. تذكر دائماً أن كل قضية لها ظروفها الخاصة.`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.slice(-10),
          { role: "user", content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json() as { choices: { message: { content: string } }[] };
    return data.choices[0]?.message?.content ?? "عذراً، لم أتمكن من معالجة طلبك.";
  } catch {
    return `شكراً على سؤالك. بصفتي ${persona}، يمكنني إخبارك أن هذا سؤال قانوني مهم. للحصول على إجابة دقيقة، يرجى استشارة محامٍ متخصص.`;
  }
}

router.post("/chat", requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = SendMessageBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "بيانات غير صحيحة" });
      return;
    }
    const { persona, message } = parsed.data;
    const userId = req.userId!;

    const users = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (users.length === 0) {
      res.status(401).json({ error: "المستخدم غير موجود" });
      return;
    }
    const user = users[0];

    if (user.balance <= 0 && user.role !== "admin") {
      res.status(402).json({ error: "رصيدك صفر. يرجى شحن رصيدك للمتابعة." });
      return;
    }

    const existingConvs = await db.select()
      .from(conversationsTable)
      .where(eq(conversationsTable.user_id, userId))
      .orderBy(conversationsTable.created_at)
      .limit(1);

    let conversation = existingConvs[0];
    let conversationHistory: { role: string; content: string }[] = [];

    if (!conversation) {
      const [newConv] = await db.insert(conversationsTable).values({
        user_id: userId,
        persona,
        messages: JSON.stringify([]),
      }).returning();
      conversation = newConv;
    } else {
      try {
        conversationHistory = JSON.parse(conversation.messages) as { role: string; content: string }[];
      } catch {
        conversationHistory = [];
      }
    }

    const reply = await getAIReply(persona, message, conversationHistory);

    conversationHistory.push({ role: "user", content: message });
    conversationHistory.push({ role: "assistant", content: reply });

    await db.update(conversationsTable)
      .set({ messages: JSON.stringify(conversationHistory) })
      .where(eq(conversationsTable.id, conversation.id));

    let newBalance = user.balance;
    if (user.role !== "admin") {
      newBalance = Math.max(0, user.balance - 1);
      await db.update(usersTable).set({ balance: newBalance }).where(eq(usersTable.id, userId));
      await db.insert(transactionsTable).values({
        user_id: userId,
        amount: -1,
        type: "chat",
        status: "completed",
      });
    }

    res.json({
      reply,
      balance: newBalance,
      conversation_id: conversation.id,
    });
  } catch (err) {
    req.log.error({ err }, "Chat error");
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
