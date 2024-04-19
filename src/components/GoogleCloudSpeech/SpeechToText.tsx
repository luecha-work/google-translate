import { useAppSelector } from "@/store/hooks";
import {
  getTranscribedText,
  setTranscribedText,
} from "@/store/slices/googleCloudSpeakingSlice";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import VoiceMicrophoneRecording from "./VoiceMicrophoneRecording";

const SpeechToText = () => {
  const dispatch = useDispatch();
  const transcribedText = useAppSelector(getTranscribedText);

  const trnascribeToGoogle = async (audioBlob: Blob) => {
    try {
      const apiKey: string = "AIzaSyBMi954FygoAdohOW60DWU9oZIlTKsyhEE";
      const googletextToSpeechUrl: string = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
      const content = await toBase64(audioBlob);

      if (!apiKey || !content) return null;

      const body = {
        audio: {
          content: content,
        },
        config: {
          languageCode: "th-TH", // ภาษาหลัก
          alternativeLanguageCodes: ["en-US", "cmn-CN"], // ภาษาที่เป็นทางเลือก
          maxAlternatives: 1, // จำนวนของคำแทนที่ API จะคืนให้ (ในที่นี้เลือก 1)
          profanityFilter: false, // ตัวกรองคำหยาบ (ไม่ใช้งานในที่นี้)
          enableAutomaticPunctuation: true, // เปิดใช้การตัดวรรคแบบอัตโนมัติ
          enableWordTimeOffsets: true, // เปิดใช้ค่าเวลาของคำพูด
          enableWordConfidence: true, // เปิดใช้ความมั่นใจในคำพูด
        },
      };

      const response = await axios
        .post(googletextToSpeechUrl, JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response: AxiosResponse) => {
          return response.data;
        });

      const transcribedText = response.results[0]?.alternatives[0]?.transcript;

      if (transcribedText) {
        return transcribedText;
      } else {
        throw new Error("No transcription found.");
      }
    } catch (error) {
      console.error("Speech-to-text error:", error);
      throw error;
    }
  };

  const toBase64 = async (file: Blob): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to read file."));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribeClick = async (audioBlob: Blob) => {
    try {
      const transcribedText = await trnascribeToGoogle(audioBlob);
      if (transcribedText) {
        dispatch(setTranscribedText(transcribedText));
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      dispatch(setTranscribedText(""));
    }
  };

  return (
    <>
      <div className="flex md:inline-flex mb-5 mt-2">
        <h3 className="flex-1">Transcribed Text: </h3>
        <p className="flex-2" style={{ color: "red" }}>
          {transcribedText}
        </p>
      </div>
      <VoiceMicrophoneRecording onRecordingStop={handleTranscribeClick} />
    </>
  );
};

export default SpeechToText;
