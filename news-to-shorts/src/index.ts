import "dotenv/config";
import { newsToShort } from "./news-short.js";

function arg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const headline = arg("--headline") ?? "Breaking news story";
const body = arg("--body") ?? headline;

newsToShort({ headline, body }).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
