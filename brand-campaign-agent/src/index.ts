import "dotenv/config";
import { runCampaign } from "./campaign.js";

const briefArg = process.argv.indexOf("--brief");
const brief =
  (briefArg !== -1 && process.argv[briefArg + 1])
    ? process.argv[briefArg + 1]!
    : "A 3-shot cinematic product reveal. Dramatic lighting, slow motion, dark background.";

runCampaign(brief).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
