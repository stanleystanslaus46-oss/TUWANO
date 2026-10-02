import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const assets = [
  ['banner-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/banner-1.webp'],
  ['banner-2.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/banner-2.webp'],
  ['video-cover-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/video-cover-1.webp'],
  ['wishbone-ring-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Wishbone-Ring-1-600x600.webp'],
  ['wishbone-ring-2.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Wishbone-Ring-2-300x300.webp'],
  ['vermeil-linked-necklace-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Vermeil-Linked-Necklace-1-600x600.webp'],
  ['vermeil-linked-necklace-2.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Vermeil-Linked-Necklace-2-300x300.webp'],
  ['tube-huggie-hoops-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Tube-Huggie-Hoops-1-600x600.webp'],
  ['tube-huggie-hoops-2.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Tube-Huggie-Hoops-2-300x300.webp'],
  ['spheres-chain-bracelet-1.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Spheres-Chain-Bracelet-Silver-1-600x600.webp'],
  ['spheres-chain-bracelet-2.webp', 'https://demo.gloriathemes.com/shinao/demo/wp-content/uploads/2026/06/Spheres-Chain-Bracelet-2-300x300.webp'],
];

const video = [
  ['shinao-jewelry-film.mp4', 'https://videos.pexels.com/video-files/9421497/9421497-uhd_2732_1440_25fps.mp4'],
];

const outDir = join(process.cwd(), 'public', 'assets', 'shinao');
await mkdir(outDir, { recursive: true });

async function download([name, url]) {
  const target = join(outDir, name);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  await writeFile(target, Buffer.from(await response.arrayBuffer()));
  console.log(`Downloaded ${name}`);
}

for (const asset of assets) await download(asset);
for (const asset of video) await download(asset);
