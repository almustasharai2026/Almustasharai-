
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Search, Info, CheckCircle2, FileType } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

const TEMPLATES = [
  { id: "1", title: "عقد إيجار سكني", description: "نموذج موحد متوافق مع القوانين المحلية.", category: "عقاري" },
  { id: "2", title: "اتفاقية عدم إفصاح (NDA)", description: "لحماية المعلومات التجارية السرية.", category: "تجاري" },
  { id: "3", title: "توكيل قانوني عام", description: "نموذج رسمي للإجراءات القضائية.", category: "عام" },
  { id: "4", title: "عقد عمل موحد", description: "متوافق مع أنظمة العمل الحديثة.", category: "عمالي" },
  { id: "5", title: "مذكرة تفاهم (MoU)", description: "إطار عمل للتعاون بين الشركاء.", category: "تجاري" },
  { id: "6", title: "إقرار وتنازل", description: "نموذج إقرار قانوني مبسط.", category: "عام" },
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [data, setData] = useState({ name: "", idNumber: "", details: "" });
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "عقاري", "تجاري", "عام", "عمالي"];

  const filtered = TEMPLATES.filter(t => 
    (t.title.includes(searchTerm)) && (activeCategory === "الكل" || t.category === activeCategory)
  );

  const handleDownload = (template: typeof TEMPLATES[0]) => {
    if (!data.name || !data.idNumber) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إكمال الاسم ورقم الهوية." });
      return;
    }

    const doc = new jsPDF();
    doc.text("ALMUSTASHAR AI - LEGAL TEMPLATES", 60, 20);
    doc.line(20, 25, 190, 25);
    doc.text(`Template: ${template.title}`, 20, 40);
    doc.text(`User: ${data.name}`, 20, 55);
    doc.text(`ID: ${data.idNumber}`, 20, 65);
    doc.text("Content:", 20, 85);
    doc.text(doc.splitTextToSize(data.details || "N/A", 160), 20, 95);
    doc.save(`${template.title}.pdf`);
    
    toast({ title: "تم التحميل", description: "تم إنشاء ملف PDF بنجاح." });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl text-right" dir="rtl">
      <header className="mb-12 space-y-4">
        <h1 className="text-4xl font-black text-white flex items-center gap-3 justify-end">
          المكتبة <span className="text-primary">القانونية</span>
          <FileText className="h-10 w-10 text-primary" />
        </h1>
        <p className="text-muted-foreground text-lg">نماذج قانونية احترافية قابلة للتخصيص والتحميل الفوري.</p>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Editor Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-card border-none rounded-[2rem] overflow-hidden sticky top-24">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-2 justify-end">
                تخصيص البيانات <CheckCircle2 className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label>الاسم الكامل</Label>
                <Input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="glass border-white/10" placeholder="أدخل اسمك كما في الهوية" />
              </div>
              <div className="space-y-2">
                <Label>رقم الهوية / السجل</Label>
                <Input value={data.idNumber} onChange={e => setData({...data, idNumber: e.target.value})} className="glass border-white/10" placeholder="رقم الهوية الوطنية" />
              </div>
              <div className="space-y-2">
                <Label>تفاصيل إضافية</Label>
                <Textarea value={data.details} onChange={e => setData({...data, details: e.target.value})} className="glass border-white/10 min-h-[120px]" placeholder="أي شروط أو تفاصيل تود إضافتها للنموذج" />
              </div>
            </CardContent>
          </Card>
          <div className="bg-primary/5 p-4 rounded-xl flex gap-3 text-xs border border-primary/20 leading-relaxed">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p>هذه النماذج استرشادية، يرجى مراجعتها مع أحد مستشارينا قبل الاعتماد الرسمي لضمان أقصى درجات الحماية القانونية.</p>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex flex-wrap gap-2 justify-end flex-grow">
                {categories.map(cat => (
                  <Button 
                    key={cat} 
                    variant={activeCategory === cat ? "default" : "outline"}
                    onClick={() => setActiveCategory(cat)}
                    className="rounded-xl px-6 h-10 glass border-white/10"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="بحث سريع..." 
                  className="pr-10 glass border-white/10 h-10 rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(t => (
              <Card key={t.id} className="glass-card border-none rounded-[2rem] hover:translate-y-[-5px] transition-all group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] px-3">{t.category}</Badge>
                    <FileType className="h-5 w-5 opacity-20" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{t.title}</CardTitle>
                  <CardDescription className="text-right leading-relaxed">{t.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 border-t border-white/5">
                  <Button className="w-full btn-primary h-12 rounded-xl gap-2" onClick={() => handleDownload(t)}>
                    <Download className="h-4 w-4" /> تخصيص وتحميل
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
