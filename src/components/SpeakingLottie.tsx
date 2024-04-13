import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";

const SpeakingLottie = () => {
  const animationPath = "/animation/animation-speeking.mp4.lottie.json";

  const [animationData, setAnimationData] = useState<any>(null);
  const isPlayingAnimation = useAppSelector(
    (state) => state.animation.isPlayingAnimation
  );
  const dispatch = useAppDispatch();

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
  }, [animationPath]);

  const defaultOptions = {
    loop: true,
    autoplay: isPlayingAnimation,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (!animationData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Lottie
        style={{ borderRadius: "20px" }}
        isStopped={!isPlayingAnimation}
        isClickToPauseDisabled
        options={defaultOptions}
        height={300}
        width={300}
      />
    </div>
  );
};

export default SpeakingLottie;
