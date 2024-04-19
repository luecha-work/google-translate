"use client";

import MicIcon from "@mui/icons-material/Mic";
import StopCircleSharpIcon from "@mui/icons-material/StopCircleSharp";
import { useEffect, useRef, useState } from "react";

interface RecorderProps {
  onRecordingStop: (blob: Blob) => void;
}

const VoiceMicrophoneRecording: React.FC<RecorderProps> = ({
  onRecordingStop,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const chunks = useRef<Array<Blob>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleStartRecording = async () => {
    setRecordingComplete(false);
    setIsRecording(true);
    setElapsedTime(0);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/wav" });
      onRecordingStop(blob);
      chunks.current = [];
    };

    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    mediaRecorder.current.start();
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current) {
      console.log(`Recording stopped`);
      mediaRecorder.current.stop();
      mediaRecorder.current = null; // Clear MediaRecorder reference
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Clear setInterval reference
    }
    setIsRecording(false);
    setRecordingComplete(true);
    chunks.current = []; // Clear Blob array
    setElapsedTime(0); // Reset elapsed time
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center w-full mt-10">
      {isRecording ? (
        <button
          onClick={handleStopRecording}
          className="m-auto p-2.5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded-full focus:outline-none relative flex-row"
        >
          <StopCircleSharpIcon style={{ color: "#FF0033" }} fontSize="medium" />
          {!recordingComplete && (
            <div className="text-sm" style={{ color: "#FF0033" }}>
              <p className="ml-3">{formatTime(elapsedTime)}</p>
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={handleStartRecording}
          className="m-auto p-2.5 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded-full focus:outline-none"
        >
          <MicIcon style={{ color: "#0F0F0F" }} fontSize="medium" />
        </button>
      )}
    </div>
  );
};

export default VoiceMicrophoneRecording;
