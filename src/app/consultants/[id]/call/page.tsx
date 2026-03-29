
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, MessageSquare, Maximize } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function VideoCallPage() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast({ variant: "destructive", title: "خطأ في الكاميرا", description: "يرجى السماح بالوصول للكاميرا." });
      }
    };
    enableCamera();
  }, [toast]);

  const handleEndCall = () => {
    router.push("/dashboard");
    toast({ title: "انتهت الجلسة", description: "تم إنهاء المكالمة بنجاح." });
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col overflow-hidden">
      {/* Remote Video (Consultant - Mock) */}
      <div className="relative flex-grow flex items-center justify-center bg-slate-900">
        <div className="text-center space-y-4">
           <div className="h-32 w-32 rounded-full bg-primary/20 mx-auto animate-pulse flex items-center justify-center border-2 border-primary/40">
              <Video className="h-12 w-12 text-primary" />
           </div>
           <p className="text-xl font-bold text-white opacity-50">في انتظار انضمام المستشار...</p>
        </div>

        {/* Local Video (User) */}
        <div className="absolute bottom-10 right-10 w-48 md:w-64 aspect-video rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl glass z-10">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
          {!isVideoOn && <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><VideoOff className="h-8 w-8 text-white/20" /></div>}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-24 glass-cosmic border-t border-white/5 flex items-center justify-center gap-4 md:gap-8 px-6">
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-14 w-14 rounded-2xl glass transition-all ${!isMicOn ? 'bg-red-500/20 text-red-500' : ''}`}
          onClick={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-14 w-14 rounded-2xl glass transition-all ${!isVideoOn ? 'bg-red-500/20 text-red-500' : ''}`}
          onClick={() => setIsVideoOn(!isVideoOn)}
        >
          {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
        </Button>

        <Button 
          variant="destructive" 
          size="icon" 
          className="h-16 w-16 rounded-3xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/20"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-8 w-8" />
        </Button>

        <div className="h-8 w-px bg-white/5 mx-2" />

        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl glass"><MessageSquare className="h-6 w-6" /></Button>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl glass"><Settings className="h-6 w-6" /></Button>
      </div>
    </div>
  );
}
