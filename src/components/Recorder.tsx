import React, { useRef, useState } from "react";

interface RecorderProps {
  onRecordingStop: (blob: Blob) => void;
}

const Recorder: React.FC<RecorderProps> = ({ onRecordingStop }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Array<Blob>>([]);

  const handleStartRecording = async () => {
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
    mediaRecorder.current.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      {recording ? (
        <button
          onClick={handleStopRecording}
          className="w-16 h-16 rounded-full bg-red-500 text-white font-bold text-lg flex items-center justify-center"
        >
          Stop
        </button>
      ) : (
        <button
          onClick={handleStartRecording}
          className="w-16 h-16 rounded-full bg-green-500 text-white font-bold text-lg flex items-center justify-center"
        >
          Start
        </button>
      )}
    </div>
  );
};

export default Recorder;
