
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
    name: "Dr. Sarah Al-Fahad",
    specialty: "Corporate Law",
    rating: 4.9,
    reviews: 124,
    location: "Riyadh, Saudi Arabia",
    image: PlaceHolderImages.find(img => img.id === "consultant-1")?.imageUrl,
    tags: ["M&A", "Tech Startups", "Contract Review"]
  },
  {
    id: "2",
    name: "Ahmed Bin Mohammed",
    specialty: "Family Law",
    rating: 4.8,
    reviews: 89,
    location: "Jeddah, Saudi Arabia",
    image: PlaceHolderImages.find(img => img.id === "consultant-2")?.imageUrl,
    tags: ["Divorce", "Inheritance", "Child Custody"]
  },
  {
    id: "3",
    name: "Laila Ibrahim",
    specialty: "Intellectual Property",
    rating: 5.0,
    reviews: 56,
    location: "Dubai, UAE",
    image: PlaceHolderImages.find(img => img.id === "consultant-3")?.imageUrl,
    tags: ["Patents", "Copyright", "Trademark"]
  },
];

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConsultants = MOCK_CONSULTANTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">Find Your Legal Expert</h1>
          <p className="text-muted-foreground">Search and connect with the right specialist for your needs.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or specialty..." 
            className="pl-10"
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
                <div>
                  <CardTitle className="text-xl font-bold text-primary">{consultant.name}</CardTitle>
                  <p className="text-accent font-medium">{consultant.specialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded text-xs font-bold text-accent">
                  <Star className="h-3 w-3 fill-accent" />
                  {consultant.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {consultant.location}
              </div>
              <div className="flex flex-wrap gap-2">
                {consultant.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={`/consultants/${consultant.id}`} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">View Profile & Book</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
          <p className="text-xl text-muted-foreground">No consultants found matching your search.</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
