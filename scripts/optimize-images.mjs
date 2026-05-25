// Build-time image optimizer: resize + convert to WebP (static-export friendly).
// Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const PUB = "public";

async function conv(input, output, width, quality = 80) {
  const info = await sharp(path.join(PUB, input))
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
    jobs.push([`results/${f}`, `results/${f.replace(/\.png$/, ".webp")}`, 900]);

const career = {
  "about-portrait.jpg": ["about-portrait.webp", 1000],
  "2016-bannatyne.jpg": ["2016-bannatyne.webp", 600],
  "2018-nuffield.jpg": ["2018-nuffield.webp", 600],
  "2019-up.jpg": ["2019-up.webp", 600],
  "2024-one.jpg": ["2024-one.webp", 600],
  "_src-2025.jpg": ["2025-cbmj.webp", 480],
};
for (const [src, [out, w]] of Object.entries(career))
  jobs.push([`career/${src}`, `career/${out}`, w]);

jobs.push(["_src-hero.jpg", "hero-portrait.webp", 900]);
jobs.push(["transformations/_src-aoife.jpg", "transformations/aoife.webp", 1200]);
jobs.push(["transformations/_src-tomas.jpg", "transformations/tomas.webp", 1200]);
jobs.push(["transformations/_src-priya.jpg", "transformations/priya.webp", 1200]);

for (const [i, o, w] of jobs) {
  try {
    await conv(i, o, w);
  } catch (e) {
    console.log(`FAIL ${o}: ${e.message}`);
  }
}
