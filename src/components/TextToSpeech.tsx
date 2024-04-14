import { useAppSelector } from "@/store/hooks";
import {
  getTranscribedText,
  toggleAnimation,
} from "@/store/slices/googleCloudSpeakingSlice";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SpeakingAnimationLottie from "./SpeakingAnimationLottie";

const TextToSpeech: NextPage = () => {
  const dispatch = useDispatch();
  const [audioUrl, setAudioUrl] = useState<string>("");

  const transcribedText = useAppSelector(getTranscribedText);

  const synthesizeTextToSpeech = async () => {
    try {
      const apiKey = "AIzaSyBMi954FygoAdohOW60DWU9oZIlTKsyhEE";
      if (!apiKey || !transcribedText) return;

      const body = {
        input: { text: transcribedText },
        voice: {
          languageCode: "th-TH",
          ssmlGender: "NEUTRAL",
        },
        audioConfig: { audioEncoding: "MP3" },
      };

      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const responseData = await response.json();
      const audioContent = responseData.audioContent;
      if (audioContent) {
        console.log(`audioContent is true`);
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
