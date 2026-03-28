import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Upload } from "lucide-react";

interface CameraCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

export function CameraCapture({ open, onOpenChange, onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImageSrc(imageSrc);
  }, [webcamRef]);

  const handleRetake = () => setImageSrc(null);

  const handleConfirm = async () => {
    if (!imageSrc) return;
    try {
      // Convert base64 to File
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(file);
      onOpenChange(false);
      setImageSrc(null);
    } catch (err) {
      console.error("Failed to process image", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">التقاط صورة للمستند</DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-border">
          {!imageSrc ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          {!imageSrc ? (
            <Button onClick={capture} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Camera className="w-5 h-5" />
              التقاط الصورة
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleRetake} className="w-full gap-2 border-border text-foreground hover:bg-secondary">
                <RefreshCw className="w-4 h-4" />
                إعادة الالتقاط
              </Button>
              <Button onClick={handleConfirm} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="w-4 h-4" />
                إرفاق الصورة
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
