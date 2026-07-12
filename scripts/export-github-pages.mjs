import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outputDirectory = path.join(root, "docs");
const clientDirectory = path.join(root, "dist", "client");
const workerUrl = pathToFileURL(path.join(root, "dist", "server", "index.js"));
workerUrl.searchParams.set("export", String(Date.now()));

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://oysterlab.github.io/", {
    headers: { accept: "text/html", host: "oysterlab.github.io" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Unable to render ebook for GitHub Pages: ${response.status}`);
}

const sitePath = "/eulra_ebook/";
const siteUrl = `https://oysterlab.github.io${sitePath}`;
let html = await response.text();

for (const directory of ["assets", "images"]) {
  html = html.replaceAll(`\"/${directory}/`, `\"${sitePath}${directory}/`);
}

html = html
  .replaceAll('"/favicon.svg', `"${sitePath}favicon.svg`)
  .replaceAll(
    "https://oysterlab.github.io/og-v2.png",
    `${siteUrl}og-v2.png`,
  )
  .replace(
    '<meta property="og:url" content="https://oysterlab.github.io"/>',
    `<meta property="og:url" content="${siteUrl}"/>`,
  )
  .replace(
    "</head>",
    `<link rel="canonical" href="${siteUrl}"/></head>`,
  );

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });
await Promise.all(
  [
    "assets/_vinext_fonts",
    ".vite",
    ".assetsignore",
    "_headers",
    "file.svg",
    "globe.svg",
    "window.svg",
  ].map((item) =>
    rm(path.join(outputDirectory, item), { recursive: true, force: true }),
  ),
);
await Promise.all([
  writeFile(path.join(outputDirectory, "index.html"), html),
  writeFile(path.join(outputDirectory, "404.html"), html),
  writeFile(path.join(outputDirectory, ".nojekyll"), ""),
]);

const pageCount = html.match(/data-reader-page/g)?.length ?? 0;
if (pageCount < 100) {
  throw new Error(`Static export contains only ${pageCount} ebook pages.`);
}

console.log(`Exported ${pageCount} pages to ${outputDirectory}`);
