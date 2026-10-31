// Build-time image optimizer: resize + convert to WebP (static-export friendly).
// Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const PUB = "public";

// The Instagram result cards are exported 1080x1350 with a "DM ME FATLOSS"
// call-to-action across the bottom. That CTA means nothing on the website, so
// trim it off and keep the header bar + photo panel (the top 1200px).
const IG_CARD = { w: 1080, h: 1350, keep: 1200 };

async function conv(input, output, width, quality = 80, cropIgFooter = false) {
  let pipe = sharp(path.join(PUB, input));
  if (cropIgFooter) {
    const { width: w, height: h } = await pipe.metadata();
    if (w === IG_CARD.w && h === IG_CARD.h) {
      pipe = pipe.extract({ left: 0, top: 0, width: w, height: IG_CARD.keep });
    }
  }
  const info = await pipe
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(path.join(PUB, output));
  console.log(`${output.padEnd(40)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

const jobs = [];

for (const f of await readdir(`${PUB}/bodyfat`))
  if (f.endsWith(".png"))
    jobs.push([`bodyfat/${f}`, `bodyfat/${f.replace(/\.png$/, ".webp")}`, 600]);

for (const f of await readdir(`${PUB}/results`))
  if (f.endsWith(".png"))
    jobs.push([`results/${f}`, `results/${f.replace(/\.png$/, ".webp")}`, 900, 82, true]);

const career = {
  "about-portrait.jpg": ["about-portrait.webp", 1000],
  "2016-bannatyne.jpg": ["2016-bannatyne.webp", 600],
  "2018-nuffield.jpg": ["2018-nuffield.webp", 600],
  "2019-up.jpg": ["2019-up.webp", 600],
  "2024-one.jpg": ["2024-one.webp", 600],
  "_src-2025.jpg": ["2025-cbmj.webp", 480],
  "about-headshot.jpg": ["about-headshot.webp", 1000, 78],
};
for (const [src, [out, w, q]] of Object.entries(career))
  jobs.push([`career/${src}`, `career/${out}`, w, q]);

jobs.push(["_src-hero-gym.jpg", "hero-gym.webp", 1300, 76]);
jobs.push(["_src-hero-gym.jpg", "hero-gym-sm.webp", 760, 74]);
jobs.push(["_src-hero-gym.jpg", "career/2025-founder.webp", 600]);
jobs.push(["transformations/_src-aoife.jpg", "transformations/aoife.webp", 1200]);
jobs.push(["transformations/_src-tomas.jpg", "transformations/tomas.webp", 1200]);
jobs.push(["transformations/_src-priya.jpg", "transformations/priya.webp", 1200]);

for (const [i, o, w, q, cropIgFooter] of jobs) {
  try {
    await conv(i, o, w, q, cropIgFooter);
  } catch (e) {
    console.log(`FAIL ${o}: ${e.message}`);
  }
}
