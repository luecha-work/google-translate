import * as textToSpeech from "@google-cloud/text-to-speech";
import * as fs from "fs";
import { useState } from "react";
import * as util from "util";

const client = new textToSpeech.TextToSpeechClient();

const TextToSpeechDemo = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const apiKey: string = "AIzaSyBMi954FygoAdohOW60DWU9oZIlTKsyhEE";

  const synthesizeSpeech = async () => {
    try {
      // Construct the request
      const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
        {
          input: { text: "Hello, World!" },
          // Select the language and SSML voice gender (optional)
          voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
          // Select the type of audio encoding
          audioConfig: { audioEncoding: "MP3" },
        };

      // Performs the text-to-speech request
      const [response] = await client.synthesizeSpeech(request);

      // Write the binary audio content to a local file
      const writeFile = util.promisify(fs.writeFile);
      await writeFile("output.mp3", response.audioContent!, "binary");

      // Create audio URL
      const audioBlob = new Blob([response.audioContent!], {
        type: "audio/mpeg",
      });
      setAudioUrl(URL.createObjectURL(audioBlob));
    } catch (err) {
      console.error("Error synthesizing speech:", err);
    }
  };

  return (
    <div>
      <button onClick={synthesizeSpeech}>Synthesize Speech</button>
      {audioUrl && <audio controls src={audioUrl} />}
    </div>
  );
};

export default TextToSpeechDemo;
