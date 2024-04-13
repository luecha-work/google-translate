import { useState } from "react";
import Recorder from "./Recorder";
import TextToSpeech from "./TextToSpeech";

const SpeechToText = () => {
  const [transcribedText, setTranscribedText] = useState<string | null>("");

  const getGoogleApiKey = (): string => {
    return "AIzaSyBMi954FygoAdohOW60DWU9oZIlTKsyhEE";
  };

  const trnascribeToGoogle = async (audioBlob: Blob) => {
    try {
      const content = await toBase64(audioBlob);
      const apiKey = getGoogleApiKey();

      if (!apiKey || !content) return null;

      const body = {
        audio: {
          content: content,
        },
        config: {
          languageCode: "th-TH",
          alternativeLanguageCodes: ["en-US", "en-GB", "de-DE"],
        },
      };

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const jsonResponse = await response.json();
      const transcribedText =
        jsonResponse.results[0]?.alternatives[0]?.transcript;

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
        setTranscribedText(transcribedText);
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setTranscribedText(null);
    }
  };

  return (
    <>
      <h2>Speech-to-Text And Display Example</h2>
      <br />
      <Recorder onRecordingStop={handleTranscribeClick} />
      <br />
      <>
        <h3>Transcribed Text: </h3>
        <p style={{ color: "red" }}> {transcribedText}</p>
      </>
      <br />
      {transcribedText ? (
        <TextToSpeech textToSpeech={transcribedText} />
      ) : (
        <></>
      )}
    </>
  );
};

export default SpeechToText;
