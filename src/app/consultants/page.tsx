
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Scale } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const MOCK_CONSULTANTS = [
  {
    id: "1",
    name: "د. سارة الفهد",
    specialty: "قانون الشركات",
    rating: 4.9,
    reviews: 124,
    location: "الرياض، المملكة العربية السعودية",
    image: PlaceHolderImages.find(img => img.id === "consultant-1")?.imageUrl,
    tags: ["الاندماج والاستحواذ", "الشركات الناشئة", "مراجعة العقود"]
  },
  {
    id: "2",
    name: "أحمد بن محمد",
    specialty: "قانون الأحوال الشخصية",
    rating: 4.8,
    reviews: 89,
    location: "جدة، المملكة العربية السعودية",
    image: PlaceHolderImages.find(img => img.id === "consultant-2")?.imageUrl,
    tags: ["الطلاق", "الميراث", "حضانة الأطفال"]
  },
  {
    id: "3",
    name: "ليلى إبراهيم",
    specialty: "الملكية الفكرية",
    rating: 5.0,
    reviews: 56,
    location: "دبي، الإمارات العربية المتحدة",
    image: PlaceHolderImages.find(img => img.id === "consultant-3")?.imageUrl,
    tags: ["براءات الاختراع", "حقوق النشر", "العلامات التجارية"]
  },
];

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConsultants = MOCK_CONSULTANTS.filter(c => 
    c.name.includes(searchTerm) || 
    c.specialty.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-12 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">ابحث عن خبيرك القانوني</h1>
          <p className="text-muted-foreground">ابحث وتواصل مع المتخصص المناسب لاحتياجاتك.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث بالاسم أو التخصص..." 
            className="pr-10 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredConsultants.map((consultant) => (
          <Card key={consultant.id} className="overflow-hidden hover:shadow-lg transition-shadow border-muted">
            <div className="relative h-48 w-full bg-muted">
              <Image 
                src={consultant.image || ""} 
                alt={consultant.name} 
                fill 
                className="object-cover"
                data-ai-hint="professional portrait"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded text-xs font-bold text-accent">
                  <Star className="h-3 w-3 fill-accent" />
                  {consultant.rating}
                </div>
                <div className="text-right">
                  <CardTitle className="text-xl font-bold text-primary">{consultant.name}</CardTitle>
                  <p className="text-accent font-medium">{consultant.specialty}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                {consultant.location}
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {consultant.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={`/consultants/${consultant.id}`} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">عرض الملف والحجز</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
          <p className="text-xl text-muted-foreground">لم يتم العثور على مستشارين يطابقون بحثك.</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>مسح البحث</Button>
        </div>
      )}
    </div>
  );
}
