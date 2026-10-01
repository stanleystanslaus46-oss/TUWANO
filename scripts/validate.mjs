import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pages = [
  "index.html","shop.html","gold.html","silver.html","rings.html",
  "necklaces.html","bracelets.html","earrings.html","product.html",
  "piercing.html","about.html","stores.html","contact.html"
];

const failures = [];
const duplicateTitles = new Map();

for (const file of pages) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    failures.push(`${file}: missing page`);
    continue;
  }

  const html = fs.readFileSync(full, "utf8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']*["']/i);
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+>/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+>/i);
  const twitterCard = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+>/i);
  const ogDescription = html.match(/<meta[^>]+property=["']og:description["'][^>]+>/i);
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+>/i);
  const viewport = html.match(/<meta[^>]+name=["']viewport["'][^>]+>/i);

  if (!title) failures.push(`${file}: missing <title>`);
  else duplicateTitles.set(title, (duplicateTitles.get(title) || 0) + 1);
  if (!description) failures.push(`${file}: missing meta description`);
  if (!canonical) failures.push(`${file}: missing canonical link`);
  if (!ogTitle) failures.push(`${file}: missing og:title`);
  if (!twitterCard) failures.push(`${file}: missing twitter:card`);
  if (!ogDescription) failures.push(`${file}: missing og:description`);
  if (!ogImage) failures.push(`${file}: missing og:image`);
  if (!viewport) failures.push(`${file}: missing viewport`);
  if (!/<html[^>]+lang=["']en["']/i.test(html)) failures.push(`${file}: missing lang="en"`);
}

for (const [title, count] of duplicateTitles) if (count > 1) failures.push(`duplicate title: ${title}`);

const robots = path.join(root, "robots.txt");
if (!fs.existsSync(robots)) failures.push("robots.txt: missing");

if (failures.length) {
  console.error("Tuwano static validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Tuwano static validation passed: ${pages.length} pages checked.`);

