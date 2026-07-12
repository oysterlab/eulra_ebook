import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html", host: "localhost" },
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
}

test("server-renders the complete Korean web ebook", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="ko"/i);
  assert.match(html, /<title>취향을 공간에 풀어내는 시대 \| ELURA<\/title>/i);
  assert.match(html, /좋아하는 것은 많은데, 왜 내 방에 둘 작품은 고르기 어려운가/);
  assert.match(html, /왜 지금 이런 서비스가 가능해졌나/);
  assert.match(html, /고객 가설은 데이터에 따라 바꿔야 한다/);
  assert.match(html, /주석과 출처/);
  assert.match(html, /@elura_studio7/);
  assert.match(html, /aria-label="모바일 독서 설정"/);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og-v2\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);

  const renderedPages = html.match(/data-reader-page/g) ?? [];
  assert.ok(
    renderedPages.length >= 100,
    `expected at least 100 explicit ebook pages, got ${renderedPages.length}`,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});

test("keeps production content and print assets self-contained", async () => {
  const [css, reader, packageJson, baseBook, expanded, cover, socialImage] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../components/EbookReader.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/base-book.json", import.meta.url), "utf8"),
    readFile(new URL("../lib/expanded-chapters.ts", import.meta.url), "utf8"),
    access(new URL("../public/images/cover.jpg", import.meta.url)),
    access(new URL("../public/og-v2.png", import.meta.url)),
  ]);

  assert.match(packageJson, /elura-space-translation-web-ebook/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(css, /@page\s*\{[\s\S]*size:\s*A5 portrait/);
  assert.match(css, /break-after:\s*page/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.mobile-paged \.page-slot\.active/);
  assert.match(reader, /brightnessEdge/);
  assert.match(reader, /ArrowRight/);
  assert.match(reader, /setReadingMode\("paged"\)/);
  assert.match(baseBook, /Pinterest, Q1 2026/);
  assert.match(expanded, /첫 조사 대상은 구체적으로 정하되/);
  assert.match(expanded, /출시 국가는 같아도 방은 모두 다르다/);
  assert.equal(cover, undefined);
  assert.equal(socialImage, undefined);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await access(new URL("../public/images/part-home.jpg", import.meta.url));
  await access(new URL("../public/images/part-future.jpg", import.meta.url));
  await access(new URL("../public/images/part-technology.jpg", import.meta.url));
  await access(new URL("../public/images/part-people.jpg", import.meta.url));
  await access(new URL("../public/images/part-translation.jpg", import.meta.url));
  await access(new URL("../public/images/part-inspiration.jpg", import.meta.url));
  await access(new URL("lib/base-book.json", projectRoot));
});
