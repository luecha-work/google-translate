import SpeakingLottie from "@/components/SpeakingLottie";
import SpeechToText from "@/components/SpeechToText";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 max-w-2xl w-full">
        <SpeechToText />
        <SpeakingLottie />
      </div>
    </main>
  );
}
