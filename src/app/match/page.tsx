
"use client";

import { useState } from "react";
import { matchConsultants, type ConsultantMatchOutput } from "@/ai/flows/ai-consultant-match-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Loader2, UserCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AIMatchPage() {
  const [description, setDescription] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<ConsultantMatchOutput | null>(null);

  const handleMatch = async () => {
    if (!description.trim()) return;
    setIsMatching(true);
    try {
      const result = await matchConsultants({ legalIssueDescription: description });
      setMatches(result);
    } catch (error) {
      console.error("Matching error:", error);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex p-3 bg-accent/10 rounded-2xl mb-4">
          <BrainCircuit className="h-10 w-10 text-accent" />
        </div>
        <h1 className="text-4xl font-headline font-bold text-primary">AI Consultant Match</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Describe your legal situation in detail, and our AI will analyze your needs to suggest the most suitable consultants.
        </p>
      </div>

      {!matches ? (
        <Card className="border-accent/20 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle>Describe your legal issue</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              The more detail you provide, the better our match will be.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <Textarea 
              placeholder="e.g., I'm a tech startup founder looking for advice on intellectual property protection and early-stage fundraising legal requirements in Saudi Arabia..." 
              className="min-h-[200px] text-lg leading-relaxed focus:ring-accent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              size="lg" 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-8 text-xl font-bold"
              disabled={isMatching || !description.trim()}
              onClick={handleMatch}
            >
              {isMatching ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Analyzing Legal Needs...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  Find My Match
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-accent" />
              Suggested Matches
            </h2>
            <Button variant="ghost" onClick={() => setMatches(null)}>New Search</Button>
          </div>
          
          <div className="grid gap-6">
            {matches.consultants.map((c, idx) => (
              <Card key={idx} className="border-l-4 border-l-accent hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl text-primary">{c.name}</CardTitle>
                      <p className="text-accent font-medium">{c.specialty}</p>
                    </div>
                    <Link href="/consultants">
                      <Button variant="outline" size="sm">
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic bg-muted p-4 rounded-lg">
                    "{c.reasonForMatch}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
