import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppGenerateDocument } from "@/hooks/use-app-api";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Loader2, File as FileIcon } from "lucide-react";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface LegalFormsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_TYPES = {
  contract: "عقد اتفاق",
  defense_memo: "مذكرة دفاع",
  lawsuit: "صحيفة دعوى",
} as const;

export function LegalFormsDialog({ open, onOpenChange }: LegalFormsDialogProps) {
  const [type, setType] = useState<keyof typeof FORM_TYPES>("contract");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<{ content: string; filename: string } | null>(null);
  
  const { mutate: generateDoc, isPending } = useAppGenerateDocument();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    generateDoc(
      { data: { type, data: formData } },
      {
        onSuccess: (res) => {
          setGeneratedDoc(res);
          toast({ title: "تم إنشاء النموذج بنجاح" });
        },
        onError: (err) => {
          toast({ title: "حدث خطأ", description: err.message, variant: "destructive" });
        }
      }
    );
  };

  const exportPDF = () => {
    if (!generatedDoc) return;
    try {
      const doc = new jsPDF();
      // Simple PDF generation (advanced Arabic needs custom fonts which is out of scope for pure frontend without assets, but we provide the implementation)
      doc.addFont('Arial', 'Arial', 'normal');
      doc.setFont('Arial');
      
      const splitText = doc.splitTextToSize(generatedDoc.content, 180);
      doc.text(splitText, 15, 20);
      doc.save(`${generatedDoc.filename}.pdf`);
      toast({ title: "تم تحميل PDF بنجاح" });
    } catch (e) {
      toast({ title: "حدث خطأ أثناء تصدير PDF", variant: "destructive" });
    }
  };

  const exportWord = async () => {
    if (!generatedDoc) return;
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: generatedDoc.content.split("\n").map(text => 
            new Paragraph({
              children: [new TextRun({ text, rightToLeft: true })],
              alignment: AlignmentType.RIGHT,
            })
          ),
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${generatedDoc.filename}.docx`);
      toast({ title: "تم تحميل Word بنجاح" });
    } catch (e) {
      toast({ title: "حدث خطأ أثناء تصدير Word", variant: "destructive" });
    }
  };

  const reset = () => {
    setType("contract");
    setFormData({});
    setGeneratedDoc(null);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">النماذج القانونية</DialogTitle>
          <DialogDescription className="text-muted-foreground">قم بملء البيانات لإنشاء صياغة قانونية سليمة</DialogDescription>
        </DialogHeader>

        {!generatedDoc ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>نوع النموذج</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="اختر نوع النموذج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">عقد اتفاق</SelectItem>
                  <SelectItem value="defense_memo">مذكرة دفاع</SelectItem>
                  <SelectItem value="lawsuit">صحيفة دعوى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === "contract" && (
                <>
                  <div className="space-y-2">
                    <Label>الطرف الأول</Label>
                    <Input placeholder="اسم الطرف الأول" onChange={(e) => handleInputChange('party1', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>الطرف الثاني</Label>
                    <Input placeholder="اسم الطرف الثاني" onChange={(e) => handleInputChange('party2', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>موضوع العقد</Label>
                    <Input placeholder="وصف مختصر لموضوع العقد" onChange={(e) => handleInputChange('subject', e.target.value)} />
                  </div>
                </>
              )}
              {type === "defense_memo" && (
                <>
                  <div className="space-y-2">
                    <Label>رقم القضية</Label>
                    <Input placeholder="أدخل رقم القضية" onChange={(e) => handleInputChange('case_number', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم المحكمة</Label>
                    <Input placeholder="المحكمة المختصة" onChange={(e) => handleInputChange('court_name', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>الدفوع الأساسية</Label>
                    <Input placeholder="ملخص للدفوع" onChange={(e) => handleInputChange('defense_points', e.target.value)} />
                  </div>
                </>
              )}
              {type === "lawsuit" && (
                <>
                  <div className="space-y-2">
                    <Label>المدعي</Label>
                    <Input placeholder="اسم المدعي" onChange={(e) => handleInputChange('plaintiff', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>المدعى عليه</Label>
                    <Input placeholder="اسم المدعى عليه" onChange={(e) => handleInputChange('defendant', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>الطلبات الختامية</Label>
                    <Input placeholder="ما يطلبه المدعي" onChange={(e) => handleInputChange('requests', e.target.value)} />
                  </div>
                </>
              )}
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isPending} 
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg shadow-primary/20 transition-all font-bold"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء الصياغة"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-background rounded-xl border border-border h-[300px] overflow-y-auto font-serif leading-loose whitespace-pre-wrap">
              {generatedDoc.content}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportPDF} variant="outline" className="flex-1 gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors">
                <FileIcon className="w-5 h-5" />
                تصدير PDF
              </Button>
              <Button onClick={exportWord} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <FileText className="w-5 h-5" />
                تصدير Word
              </Button>
              <Button onClick={() => setGeneratedDoc(null)} variant="ghost" className="flex-none text-muted-foreground">
                نموذج جديد
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
