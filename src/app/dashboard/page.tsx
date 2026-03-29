
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Video, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  History
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
  const upcomingBookings = [
    { id: "b1", consultant: "Dr. Sarah Al-Fahad", date: "Oct 24, 2024", time: "10:00 AM", type: "Video Call", status: "Confirmed" },
    { id: "b2", consultant: "Ahmed Bin Mohammed", date: "Oct 28, 2024", time: "02:30 PM", type: "Chat", status: "Pending" },
  ];

  const pastConsultations = [
    { id: "p1", consultant: "Laila Ibrahim", date: "Sep 15, 2024", topic: "Trademark Registration" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Welcome back, Nasser</h1>
          <p className="text-muted-foreground">Manage your consultations and account settings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto border-2 border-accent">
                <User className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Nasser Al-Otaibi</h3>
                <p className="text-sm opacity-70">nasser.otaibi@example.com</p>
              </div>
              <Button variant="secondary" size="sm" className="w-full">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatRow label="Total Consultations" value="12" />
              <StatRow label="Upcoming Sessions" value="2" />
              <StatRow label="Saved Consultants" value="5" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming Bookings
              </h2>
              <Link href="/consultants">
                <Button variant="link" size="sm">Book New</Button>
              </Link>
            </div>
            
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="hover:border-accent/50 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{booking.consultant}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                      <Button size="sm">Join Session</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Past Consultations
            </h2>
            <Card>
              <CardContent className="p-0">
                {pastConsultations.map((p, idx) => (
                  <div key={p.id} className={`p-4 flex items-center justify-between ${idx !== pastConsultations.length - 1 ? 'border-b' : ''}`}>
                    <div className="space-y-1">
                      <p className="font-medium text-primary">{p.consultant}</p>
                      <p className="text-sm text-muted-foreground">{p.topic}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">{p.date}</p>
                      <Button variant="outline" size="sm">View Notes</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-primary">{value}</span>
    </div>
  );
}
