import "dotenv/config";
import { generateReel } from "./reel.js";

function arg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const product = arg("--product") ?? "A luxury product. Cinematic, dark background.";
const imageUrl = arg("--image");
const duration = parseInt(arg("--duration") ?? "20", 10);
const aspect = (arg("--aspect") ?? "16:9") as "16:9" | "9:16" | "1:1";

generateReel({ product, imageUrl, duration, aspect }).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
