
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Search, Info } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

const LEGAL_TEMPLATES = [
  { id: "1", title: "عقد إيجار سكني", description: "نموذج عقد إيجار موحد للأغراض السكنية.", type: "PDF" },
  { id: "2", title: "اتفاقية عدم إفصاح (NDA)", description: "حماية المعلومات السرية بين طرفين.", type: "Word" },
  { id: "3", title: "توكيل قانوني عام", description: "نموذج توكيل لمتابعة الإجراءات القانونية.", type: "PDF" },
  { id: "4", title: "عقد عمل محدد المدة", description: "عقد عمل متوافق مع قوانين العمل المحلية.", type: "PDF" },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [fillingData, setFillingData] = useState({ name: "", date: "", details: "" });

  const filtered = LEGAL_TEMPLATES.filter(t => t.title.includes(searchTerm));

  const handleDownload = (template: typeof LEGAL_TEMPLATES[0]) => {
    if (!fillingData.name) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إدخال اسمك لتضمينه في النموذج." });
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.text("Legal Document: " + template.title, 10, 10);
    doc.text("Issued to: " + fillingData.name, 10, 20);
    doc.text("Date: " + (fillingData.date || new Date().toLocaleDateString()), 10, 30);
    doc.text("Content: This is a generated legal template for demonstration.", 10, 40);
    
    doc.save(`${template.title}.pdf`);
    toast({ title: "تم التحميل", description: "تم إنشاء وتحميل الملف بنجاح." });
  };

  return (
    <div className="container mx-auto px-4 py-12 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2 justify-end">
            النماذج والقوالب القانونية
            <FileText className="h-8 w-8 text-accent" />
          </h1>
          <p className="text-muted-foreground">قم بتعبئة وتحميل نماذج قانونية جاهزة ومعتمدة.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن نموذج..." 
            className="pr-10 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">تخصيص النموذج</CardTitle>
              <CardDescription>أدخل البيانات ليتم تضمينها في الملف</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-right">
                <Label>الاسم الكامل</Label>
                <Input value={fillingData.name} onChange={e => setFillingData({...fillingData, name: e.target.value})} placeholder="اسمك الكامل" />
              </div>
              <div className="space-y-2 text-right">
                <Label>التاريخ</Label>
                <Input type="date" value={fillingData.date} onChange={e => setFillingData({...fillingData, date: e.target.value})} />
              </div>
            </CardContent>
          </Card>
          <div className="bg-muted p-4 rounded-lg flex gap-3 text-sm text-muted-foreground items-start">
            <Info className="h-5 w-5 text-accent shrink-0" />
            <p>جميع النماذج هنا هي نماذج استرشادية، ننصح دائماً بمراجعة محامٍ متخصص قبل التوقيع.</p>
          </div>
        </div>

        <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
          {filtered.map(template => (
            <Card key={template.id} className="hover:border-accent transition-colors shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">{template.type}</div>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                </div>
                <CardDescription className="text-right">{template.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full gap-2" onClick={() => handleDownload(template)}>
                  <Download className="h-4 w-4" /> تحميل الآن
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
