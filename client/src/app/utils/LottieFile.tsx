import React from "react";
import Lottie from "react-lottie";
import Animtion from "./kanban.json";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: Animtion,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const LottieFile = () => {
  return (
    <Lottie
      options={defaultOptions}
      height={500}
      width={500}
      isClickToPauseDisabled={true}
    />
  );
};

export default LottieFile;
