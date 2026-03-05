/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Audio Recorder Component
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, Square, Pause, Play, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // seconds, default 3 hours
}

export function AudioRecorder({ 
  onRecordingComplete,
  maxDuration = 10800 // 3 hours
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Request microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      stopRecording();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      setError(null);
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions in your browser settings.");
      setPermissionGranted(false);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Setup audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // Start visualization
      visualize();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Stop visualization
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        if (onRecordingComplete) {
          onRecordingComplete(blob, duration);
        }

        toast.success(`Recording completed! Duration: ${formatDuration(duration)}`);
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            toast.warning("Maximum recording duration reached");
          }
          return newDuration;
        });
      }, 1000);

    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to start recording. Please check your microphone permissions.");
      toast.error("Failed to start recording");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.info("Recording paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
      
      toast.info("Recording resumed");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setDuration(0);
    audioChunksRef.current = [];
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgb(240, 240, 245)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(139, 92, 246)"; // Purple color

      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const durationPercentage = (duration / maxDuration) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Record Lecture
        </CardTitle>
        <CardDescription>
          Record your lecture directly in the browser (max {Math.floor(maxDuration / 3600)} hours)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!permissionGranted && !error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Microphone permission required. Click "Start Recording" to grant access.
            </AlertDescription>
          </Alert>
        )}

        {/* Waveform Visualization */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={100}
            className="w-full h-24 rounded-md border bg-muted"
          />
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-md">
              <span className="text-sm text-muted-foreground">
                {audioBlob ? "Recording complete" : "Ready to record"}
              </span>
            </div>
          )}
        </div>

        {/* Duration Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-purple-600">
            {formatDuration(duration)}
          </div>
          <Progress value={durationPercentage} className="mt-2 h-1" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && !isPaused && (
            <>
              <Button onClick={pauseRecording} variant="outline" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}

          {isRecording && isPaused && (
            <>
              <Button onClick={resumeRecording} size="lg">
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <Button onClick={resetRecording} variant="outline" size="lg">
                Record Again
              </Button>
              <Button 
                onClick={() => {
                  if (onRecordingComplete) {
                    onRecordingComplete(audioBlob, duration);
                  }
                }}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Upload className="w-5 h-5 mr-2" />
                Save Recording
              </Button>
            </>
          )}
        </div>

        {/* Audio Preview */}
        {audioBlob && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
