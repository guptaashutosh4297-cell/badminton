import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import dotenv from "dotenv";

dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  console.log("--> Step 1: Asking Claude for today's badminton skill...");

  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `Choose a distinct, intermediate-to-advanced badminton technique (e.g. cross-court net tumble, reverse slice drop, stick smash, backhand clear, deception flick serve).
Generate a structured tutorial payload formatted strictly as valid JSON with no markdown wrapping and no backticks:
{
  "title": "SHORT TITLE (max 3 words)",
  "phase1": "Step 1 setup (max 7 words)",
  "phase2": "Step 2 execution (max 7 words)",
  "phase3": "Step 3 contact/follow-through (max 7 words)",
  "proTip": "Common flaw or critical tip (max 10 words)",
  "voiceover": "A natural, energetic 60-word voiceover script covering the intro, 3 steps, and tip to be spoken in ~26 seconds."
}`
      }
    ]
  });

  const rawJson = msg.content[0].text.trim().replace(/^```json\s*|\s*```$/g, "");
  const reelData = JSON.parse(rawJson);
  console.log(`[Success] Skill generated: ${reelData.title}`);

  const propsPath = path.resolve("src", "defaultData.json");
  fs.writeFileSync(propsPath, JSON.stringify(reelData, null, 2));

  console.log("--> Step 2: Generating voiceover audio via TTS...");
  const mp3Response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: reelData.voiceover,
    speed: 1.05
  });

  const publicDir = path.resolve("public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());
  fs.writeFileSync(path.join(publicDir, "voiceover.mp3"), audioBuffer);
  console.log("[Success] Saved voiceover.mp3 to public directory");

  console.log("--> Step 3: Rendering 1080x1920 MP4 via Remotion...");
  const outDir = path.resolve("out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const cleanTitle = reelData.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  const outputPath = path.join(outDir, `${cleanTitle}.mp4`);

  execSync(
    `npx remotion render src/index.ts BadmintonReel "${outputPath}" --props="${propsPath}"`,
    { stdio: "inherit" }
  );

  console.log(`\n🎉 Pipeline completed! Rendered video saved at: ${outputPath}`);
}

run().catch((err) => {
  console.error("Pipeline failure:", err);
  process.exit(1);
});
