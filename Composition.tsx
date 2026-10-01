import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface ReelProps {
  title: string;
  phase1: string;
  phase2: string;
  phase3: string;
  proTip: string;
  voiceover?: string;
}

export const BadmintonReel: React.FC<ReelProps> = ({
  title,
  phase1,
  phase2,
  phase3,
  proTip,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress helpers: 30s = 900 frames at 30fps
  const step1Opacity = interpolate(frame, [150, 170, 340, 360], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step2Opacity = interpolate(frame, [360, 380, 550, 570], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step3Opacity = interpolate(frame, [570, 590, 760, 780], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shuttleY = interpolate(frame, [650, 685], [600, 1650], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shuttleX = interpolate(frame, [650, 685], [300, 950], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shuttleScale = interpolate(frame, [650, 660, 685], [0, 1.2, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleBounce = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#020617", color: "#ffffff", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Audio src={staticFile("voiceover.mp3")} />

      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(2,6,23,0) 70%)",
        }}
      />

      <div style={{ position: "absolute", top: 160, width: "100%", textAlign: "center", transform: `scale(${titleBounce})` }}>
        <span
          style={{
            color: "#38bdf8",
            fontSize: 28,
            letterSpacing: 6,
            fontWeight: 800,
            textTransform: "uppercase",
            border: "2px solid #0284c7",
            padding: "8px 24px",
            borderRadius: 999,
          }}
        >
          Daily Badminton Pro Tip
        </span>
        <h1
          style={{
            fontSize: 76,
            fontWeight: 900,
            margin: "40px 40px 0 40px",
            lineHeight: 1.1,
            background: "linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>
      </div>

      <div style={{ position: "absolute", top: 780, width: "100%", padding: "0 80px", boxSizing: "border-box" }}>
        <div style={{ opacity: step1Opacity, position: "absolute", width: "85%" }}>
          <div style={{ color: "#38bdf8", fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>PHASE 01</div>
          <div style={{ color: "#f8fafc", fontSize: 52, fontWeight: 700, marginTop: 12, lineHeight: 1.25 }}>{phase1}</div>
        </div>

        <div style={{ opacity: step2Opacity, position: "absolute", width: "85%" }}>
          <div style={{ color: "#facc15", fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>PHASE 02</div>
          <div style={{ color: "#f8fafc", fontSize: 52, fontWeight: 700, marginTop: 12, lineHeight: 1.25 }}>{phase2}</div>
        </div>

        <div style={{ opacity: step3Opacity, position: "absolute", width: "85%" }}>
          <div style={{ color: "#4ade80", fontSize: 32, fontWeight: 800, letterSpacing: 2 }}>PHASE 03</div>
          <div style={{ color: "#f8fafc", fontSize: 52, fontWeight: 700, marginTop: 12, lineHeight: 1.25 }}>{phase3}</div>
        </div>
      </div>

      {frame >= 650 && frame <= 685 && (
        <div
          style={{
            position: "absolute",
            left: shuttleX,
            top: shuttleY,
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#ef4444",
            boxShadow: "0 0 35px #ef4444, 0 0 15px #ffffff",
            transform: `scale(${shuttleScale})`,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 60,
          right: 60,
          padding: "28px 36px",
          background: "rgba(30, 41, 59, 0.75)",
          borderRadius: 24,
          border: "1px solid #334155",
          backdropFilter: "blur(12px)",
        }}
      >
        <span style={{ color: "#ef4444", fontSize: 24, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase" }}>Key Mistake to Avoid</span>
        <p style={{ margin: "10px 0 0 0", color: "#e2e8f0", fontSize: 32, fontWeight: 600, lineHeight: 1.3 }}>
          {proTip}
        </p>
      </div>
    </AbsoluteFill>
  );
};
