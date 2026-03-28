import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { GenerateDocumentBody } from "@workspace/api-zod";

const router: IRouter = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("نوع الملف غير مدعوم"));
    }
  },
});

router.post("/upload", requireAuth, upload.single("file"), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "لم يتم رفع أي ملف" });
      return;
    }

    let text = "";
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === ".txt") {
      text = fs.readFileSync(req.file.path, "utf-8");
    } else {
      text = `تم رفع الملف: ${req.file.originalname}`;
    }

    res.json({
      url: `/api/uploads/${req.file.filename}`,
      filename: req.file.originalname,
      text,
    });
  } catch (err) {
    req.log.error({ err }, "Upload error");
    res.status(500).json({ error: "خطأ في رفع الملف" });
  }
});

const DOCUMENT_TEMPLATES: Record<string, (data: Record<string, string>) => string> = {
  contract: (data) => `
عقد اتفاقية

بسم الله الرحمن الرحيم

هذا العقد مبرم بتاريخ ${data["date"] ?? new Date().toLocaleDateString("ar-EG")}

بين الطرف الأول: ${data["party1"] ?? "الطرف الأول"}
وبين الطرف الثاني: ${data["party2"] ?? "الطرف الثاني"}

موضوع العقد:
${data["subject"] ?? "موضوع العقد"}

الشروط والأحكام:
${data["terms"] ?? "يتفق الطرفان على الالتزام بجميع البنود الواردة في هذا العقد"}

التوقيعات:
الطرف الأول: ________________     الطرف الثاني: ________________
`,
  defense_memo: (data) => `
مذكرة دفاع

محكمة: ${data["court"] ?? "المحكمة المختصة"}
القضية رقم: ${data["case_number"] ?? "رقم القضية"}
التاريخ: ${data["date"] ?? new Date().toLocaleDateString("ar-EG")}

المتهم: ${data["defendant"] ?? "المتهم"}
المحامي: ${data["lawyer"] ?? "المحامي"}

وقائع الدعوى:
${data["facts"] ?? "وقائع القضية"}

أوجه الدفاع:
${data["defense"] ?? "أوجه الدفاع القانونية"}

الطلبات:
${data["requests"] ?? "نطلب من عدالة المحكمة الحكم ببراءة الموكل"}

المحامي: ________________
`,
  lawsuit: (data) => `
صحيفة دعوى

إلى: ${data["court"] ?? "المحكمة المختصة"}

المدعي: ${data["plaintiff"] ?? "المدعي"}
المدعى عليه: ${data["defendant"] ?? "المدعى عليه"}
التاريخ: ${data["date"] ?? new Date().toLocaleDateString("ar-EG")}

موضوع الدعوى:
${data["subject"] ?? "موضوع الدعوى"}

وقائع الدعوى:
${data["facts"] ?? "وقائع الدعوى"}

الطلبات:
${data["requests"] ?? "نطلب الحكم للمدعي بما يستحق قانوناً"}

وكيل المدعي: ________________
`,
};

router.post("/generate-document", requireAuth, async (req: AuthRequest, res) => {
  try {
    const parsed = GenerateDocumentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "بيانات غير صحيحة" });
      return;
    }
    const { type, data } = parsed.data;
    const template = DOCUMENT_TEMPLATES[type];
    if (!template) {
      res.status(400).json({ error: "نوع النموذج غير مدعوم" });
      return;
    }
    const content = template(data as Record<string, string>);
    const typeNames: Record<string, string> = {
      contract: "عقد",
      defense_memo: "مذكرة_دفاع",
      lawsuit: "صحيفة_دعوى",
    };
    const filename = `${typeNames[type] ?? type}_${Date.now()}.txt`;

    res.json({ content, filename });
  } catch (err) {
    req.log.error({ err }, "Generate document error");
    res.status(500).json({ error: "خطأ في إنشاء النموذج" });
  }
});

export default router;
