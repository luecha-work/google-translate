"use client";
import { useAppSelector } from "@/store/hooks";
import { getIsPlayingAnimation } from "@/store/slices/googleCloudSpeakingSlice";
import { IconButton } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";

interface SpeakingAnimationLottieProps {
  handlerPlayAudio: () => void;
}

const SpeakingAnimationLottie: NextPage<SpeakingAnimationLottieProps> = ({
  handlerPlayAudio,
}) => {
  const animationPath = "/animation/animation-speeking.mp4.lottie.json";
  const [animationData, setAnimationData] = useState<any>(null);

  const isPlayingAnimation = useAppSelector(getIsPlayingAnimation);

  useEffect(() => {
    const fetchAnimationData = async () => {
      try {
        const response = await fetch(animationPath);
        const json = await response.json();
        setAnimationData(json);
      } catch (error) {
        console.error("Error fetching animation data:", error);
      }
    };

    fetchAnimationData();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: isPlayingAnimation,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {animationData ? (
        <IconButton
          aria-label="animation-speeking"
          onClick={() => {
            handlerPlayAudio();
          }}
        >
          <Lottie
            isStopped={!isPlayingAnimation}
            isClickToPauseDisabled
            options={defaultOptions}
            height={200}
            width={200}
          />
        </IconButton>
      ) : (
        <> </>
      )}
    </div>
  );
};

export default SpeakingAnimationLottie;
