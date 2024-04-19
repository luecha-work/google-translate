import { GoogleCloudLanguageCode } from "@/contract/GoogleCloudLanguage";
import { useAppSelector } from "@/store/hooks";
import {
  getTranscribedText,
  toggleAnimation,
} from "@/store/slices/googleCloudSpeakingSlice";
import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SpeakingAnimationLottie from "./SpeakingAnimationLottie";

interface TextToSpeechProps {
  googleLanguageCode?: (typeof GoogleCloudLanguageCode)[keyof typeof GoogleCloudLanguageCode];
}

const TextToSpeech: NextPage<TextToSpeechProps> = ({ googleLanguageCode }) => {
  const dispatch = useDispatch();
  const [audioUrl, setAudioUrl] = useState<string>("");

  const transcribedText = useAppSelector(getTranscribedText);

  const synthesizeTextToSpeech = async () => {
    googleLanguageCode = googleLanguageCode || GoogleCloudLanguageCode.Thailand;

    try {
      const apiKey: string = "AIzaSyBMi954FygoAdohOW60DWU9oZIlTKsyhEE";
      const googletextToSpeechUrl: string = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

      if (!apiKey || !transcribedText) return;

      // Standard-A: เสียงมาตรฐาน
      // Wavenet-A: เสียงที่สร้างด้วยเทคโนโลยี Wavenet
      // modal support thailand leng is 1.th-TH-Standard-A 2.th-TH-Neural2-C
      // MALE: สำหรับเสียงผู้ชาย
      // FEMALE: สำหรับเสียงผู้หญิง
      // NEUTRAL: เสียงที่ไม่มีเพศเฉพาะ
      const ssmlTranscribed = `<speak>${transcribedText}</speak>`;

      const body = {
        input: {
          ssml: ssmlTranscribed,
        },
        voice: {
          languageCode: googleLanguageCode,
          name: `${googleLanguageCode}-Standard-A`,
          ssmlGender: "MALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
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

      const audioContent = response.audioContent;
      if (audioContent) {
        const audioBlob = base64StringToBlob(audioContent, "audio/mp3");
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioUrl);
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
    }
  };

  const base64StringToBlob = (base64String: string, contentType: string) => {
    const sliceSize = 1024;
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const playAudio = () => {
    if (transcribedText !== "") {
      dispatch(toggleAnimation(true));

      const audio = new Audio(audioUrl);

      audio.play().catch((error) => {
        console.error("Audio playback error:", error);
      });

      audio.onended = () => {
        dispatch(toggleAnimation(false));
      };
    }
  };

  useEffect(() => {
    synthesizeTextToSpeech();
  }, [transcribedText]);

  return <SpeakingAnimationLottie handlerPlayAudio={playAudio} />;
};

export default TextToSpeech;
