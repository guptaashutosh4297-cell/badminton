import React from "react";
import { Composition } from "remotion";
import { BadmintonReel } from "./Composition.js";
import defaultData from "./defaultData.json" assert { type: "json" };

export const Root: React.FC = () => {
  return (
    <Composition
      id="BadmintonReel"
      component={BadmintonReel}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultData}
    />
  );
};
