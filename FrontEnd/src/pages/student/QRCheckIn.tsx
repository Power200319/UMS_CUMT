import { useState, useRef, useEffect } from "react";
import { QrCode, Camera, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function QRCheckIn() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [nextClass, setNextClass] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchNextClass();
  }, []);

  const fetchNextClass = async () => {
    try {
      // In a real implementation, this would get the current student's schedule
      // For now, we'll simulate
      const mockClass = {
        subject: "Computer Science",
        room: "Room 101",
        start_time: "08:00",
        end_time: "09:30",
        teacher: "Dr. Smith"
      };
      setNextClass(mockClass);
    } catch (error) {
      console.error('Error fetching next class:', error);
    }
  };

  const startScanning = async () => {
    setScanning(true);
    setResult(null);
    setStatus(null);
    setMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Simulate QR code scanning (in real implementation, use a QR library)
        setTimeout(() => {
          simulateQRScan();
        }, 2000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setStatus('error');
      setMessage('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateQRScan = async () => {
    // Simulate scanning a QR code
    const mockToken = 'abc123def456'; // This would come from actual QR scan
    const studentId = 1; // This would come from current user context

    try {
      const response = await fetch('/api/student/scan-qr/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: mockToken,
          student_id: studentId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage(data.message);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setMessage(errorData.error || 'Failed to record attendance.');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setStatus('error');
      setMessage('An error occurred while recording attendance.');
    } finally {
      stopScanning();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
        <p className="text-gray-600 mt-2">Scan QR code to check-in for your class</p>
      </div>

      {/* Next Class Info */}
      {nextClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-semibold">{nextClass.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room</p>
                <p className="font-semibold">{nextClass.room}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{nextClass.start_time} - {nextClass.end_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teacher</p>
                <p className="font-semibold">{nextClass.teacher}</p>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Wait for teacher to start the session
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              {scanning ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Camera ready for scanning</p>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-center">
            {!scanning ? (
              <Button onClick={startScanning} size="lg">
                <QrCode className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="outline" size="lg">
                Stop Scanning
              </Button>
            )}
          </div>

          {status && (
            <Alert className={status === 'success' ? 'border-green-500' : 'border-red-500'}>
              {status === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={status === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>Position the QR code within the camera view</p>
            <p>Make sure you have good lighting for better scanning</p>
            <p className="mt-2 font-medium text-orange-600">
              ⚠️ You can only scan after the teacher has checked in
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Wait for your teacher to check-in first</li>
            <li>Scan the QR code within the first 15 minutes of class</li>
            <li>Late arrivals after 5 minutes will be marked as "Late"</li>
            <li>You can check-out at the end of class (optional)</li>
            <li>Once the teacher checks out, the session closes</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}