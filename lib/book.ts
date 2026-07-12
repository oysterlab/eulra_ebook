import baseBookJson from "./base-book.json";
import { expandedChapters, partDefinitions } from "./expanded-chapters";
import type {
  Chapter,
  ReaderPage,
  SourceNote,
  TextBlock,
} from "./book-types";

type BaseSection = {
  id: string;
  kind: string;
  title: string;
  blocks: TextBlock[];
};

const baseBook = baseBookJson as {
  sections: BaseSection[];
  sources: SourceNote[];
};

const deckById: Record<string, string> = {
  "base-01":
    "가구와 장식을 모두 갖췄는데도 사는 사람의 취향이 보이지 않는 이유를 살펴본다.",
  "base-02":
    "화상회의와 소셜미디어, 재택 생활이 집 꾸미기 기준에 어떤 영향을 줬는지 살펴본다.",
  "base-03":
    "자가가 아니어도 처음으로 내 취향을 담게 되는 시점과 그때 필요한 물건을 알아본다.",
  "base-04":
    "예쁜 집을 많이 저장할수록 실제 방에 둘 작품을 고르기 어려워지는 이유를 설명한다.",
  "base-05":
    "재팬디·미드센추리 같은 스타일 이름의 장점과 한계를 실제 선택 사례로 살펴본다.",
  "base-06":
    "좋아하는 자료, 실제 방의 조건, 예산과 제작 정보를 함께 비교하는 방법을 제시한다.",
  "base-07":
    "저장 이미지와 음악, 여행 사진에서 실제 취향을 확인할 때 필요한 질문을 다룬다.",
  "base-08":
    "AI가 방 사진과 참고 이미지를 함께 분석할 수 있는 범위와 직접 확인해야 할 한계를 구분한다.",
  "base-09":
    "한 점씩 제작하는 주문형 생산이 맞춤 작품의 재고와 비용 구조를 어떻게 바꿨는지 살펴본다.",
  "base-10":
    "AI 결과가 많아질수록 비교 부담이 커지는 조건과 결과 수를 줄여야 하는 이유를 설명한다.",
  "base-11":
    "여성을 첫 조사 대상으로 정한 공개 자료와 한계, 반드시 함께 비교해야 할 고객군을 밝힌다.",
  "base-12":
    "나이보다 이사·독립·동거·이별·재택근무가 작품 구매 시점을 더 잘 설명하는지 검토한다.",
  "base-13":
    "미국·캐나다·영국을 첫 후보로 정한 전자상거래·주거·운영 근거와 바꿀 조건을 정리한다.",
  "base-14":
    "좋아하는 장소와 음악에서 색·선·밝기·반복을 찾아 실제 작품 구성으로 풀어내는 과정을 보여 준다.",
  "base-15":
    "개인 자료를 많이 반영한 결과, 방과 잘 맞는 결과, 새 취향을 제안하는 결과를 비교한다.",
};

const visualByChapter: Partial<Record<string, TextBlock>> = {
  "base-01": { type: "visual", visual: "translation-gap" },
  "base-04": { type: "visual", visual: "pinterest-scale" },
  "base-08": { type: "visual", visual: "why-now" },
  "base-10": { type: "visual", visual: "choice-overload" },
  "base-11": { type: "visual", visual: "women-signal" },
  "base-12": { type: "visual", visual: "life-stage" },
  "base-13": { type: "visual", visual: "market-lab" },
  "base-15": { type: "visual", visual: "three-directions" },
};

const baseChapters: Chapter[] = baseBook.sections
  .filter((section) => section.kind === "chapter")
  .map((section) => ({
    id: section.id,
    title: section.title,
    deck: deckById[section.id] ?? "",
    blocks: visualByChapter[section.id]
      ? [...section.blocks, visualByChapter[section.id]!]
      : section.blocks,
    source: "base",
  }));

export const chapters: Chapter[] = [
  ...baseChapters,
  ...expandedChapters,
];

const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
const baseSectionMap = new Map(
  baseBook.sections.map((section) => [section.id, section]),
);

const blockWeight = (block: TextBlock) => {
  switch (block.type) {
    case "paragraph":
      return block.text.length;
    case "subheading":
      return block.text.length + 150;
    case "quote":
      return block.text.length + 230;
    case "list":
      return block.items.join("").length + 190;
    case "callout":
      return block.label.length + block.text.length + 220;
    case "visual":
    case "image":
      return Number.POSITIVE_INFINITY;
  }
};

const MAX_PAGE_WEIGHT = 620;

function paginateBlocks(
  blocks: TextBlock[],
  prefix: string,
  context: Partial<ReaderPage>,
) {
  const pages: ReaderPage[] = [];
  let current: TextBlock[] = [];
  let weight = 0;
  let index = 1;

  const flush = () => {
    if (!current.length) return;
    pages.push({
      id: `${prefix}-page-${index}`,
      kind: "reading",
      blocks: current,
      ...context,
    });
    current = [];
    weight = 0;
    index += 1;
  };

  for (const block of blocks) {
    if (block.type === "visual") {
      flush();
      pages.push({
        id: `${prefix}-visual-${index}`,
        kind: "visual",
        blocks: [block],
        ...context,
      });
      index += 1;
      continue;
    }

    if (block.type === "image") {
      flush();
      pages.push({
        id: `${prefix}-image-${index}`,
        kind: "image",
        image: block.src,
        imageAlt: block.alt,
        deck: block.caption,
        ...context,
      });
      index += 1;
      continue;
    }

    const nextWeight = blockWeight(block);
    if (current.length && weight + nextWeight > MAX_PAGE_WEIGHT) flush();
    current.push(block);
    weight += nextWeight;
  }

  flush();
  return pages;
}

const pages: ReaderPage[] = [
  {
    id: "cover",
    kind: "cover",
    eyebrow: "ELURA CULTURE FORECAST 01",
    title: "취향을 공간에 풀어내는 시대",
    deck: "좋아하는 것은 많은데, 왜 내 방에 둘 작품은 고르기 어려운가",
    image: "images/cover.jpg",
    imageAlt:
      "책과 음반, 열쇠가 놓인 도시의 거실과 큰 추상 작품이 걸린 벽",
  },
  {
    id: "thesis",
    kind: "colophon",
    eyebrow: "이 책의 명제",
    title: "참고 이미지는 많아졌지만, 실제 작품을 고르기는 더 어려워졌다.",
    deck:
      "문제는 취향이 없는 데 있지 않다. 저장한 이미지와 기억을 지금 방의 크기·빛·가구·예산에 맞는 작품으로 좁힐 기준이 부족하다.",
  },
  {
    id: "publication-note",
    kind: "colophon",
    eyebrow: "출간 노트",
    title: "이 책은 확인된 사실과 제품 가설을 구분한다.",
    deck:
      "통계와 기술 설명에는 출처를 붙였고, 가상 사례는 실제 인터뷰와 구분했다. ELURA의 고객·국가·결과 수는 앞으로 검증할 가설로 표시했다.",
  },
];

for (let i = 0; i < partDefinitions.length; i += 2) {
  const slice = partDefinitions.slice(i, i + 2);
  pages.push({
    id: `contents-${i / 2 + 1}`,
    kind: "contents",
    eyebrow: i === 0 ? "차례" : "차례 계속",
    title: slice.map((part) => `${part.number}부 ${part.title}`).join(" / "),
    deck: slice
      .flatMap((part) =>
        part.chapterIds.map((id) => chapterMap.get(id)?.title ?? id),
      )
      .join(" · "),
    blocks: slice.map((part) => ({
      type: "callout" as const,
      label: `${part.number}부 · ${part.title}`,
      text: part.chapterIds
        .map((id) => chapterMap.get(id)?.title ?? id)
        .join(" / "),
    })),
  });
}

const prologue = baseSectionMap.get("prologue");
if (prologue) {
  pages.push({
    id: "prologue-title",
    kind: "chapter-title",
    eyebrow: "프롤로그",
    title: prologue.title,
    deck:
      "이사를 마친 뒤 작품 하나를 고르지 못하는 장면에서, 참고 이미지가 많아도 결정이 어려운 이유를 시작한다.",
  });
  pages.push(
    ...paginateBlocks(prologue.blocks, "prologue", {
      chapterId: "prologue",
      eyebrow: "프롤로그",
      title: prologue.title,
    }),
  );
}

let chapterNumber = 1;
for (const part of partDefinitions) {
  pages.push({
    id: part.id,
    kind: "part",
    partId: part.id,
    partNumber: part.number,
    eyebrow: `${part.number}부`,
    title: part.title,
    deck: part.deck,
    image: part.image,
    imageAlt: `${part.title} 장을 여는 ELURA 공간 이미지`,
  });

  for (const chapterId of part.chapterIds) {
    const chapter = chapterMap.get(chapterId);
    if (!chapter) continue;

    pages.push({
      id: `${chapter.id}-title`,
      kind: "chapter-title",
      partId: part.id,
      partNumber: part.number,
      chapterId: chapter.id,
      chapterNumber,
      eyebrow: `${chapterNumber}장`,
      title: chapter.title,
      deck: chapter.deck,
    });

    pages.push(
      ...paginateBlocks(chapter.blocks, chapter.id, {
        partId: part.id,
        partNumber: part.number,
        chapterId: chapter.id,
        chapterNumber,
        eyebrow: `${chapterNumber}장`,
        title: chapter.title,
      }),
    );

    chapterNumber += 1;
  }
}

for (const endingId of ["epilogue", "afterword"]) {
  const ending = baseSectionMap.get(endingId);
  if (!ending) continue;
  pages.push({
    id: `${endingId}-title`,
    kind: "chapter-title",
    eyebrow: endingId === "epilogue" ? "에필로그" : "저자의 노트",
    title: ending.title,
    deck:
      endingId === "epilogue"
        ? "반복해서 저장한 색과 빛을 기준으로 실제 작품을 고르는 방법을 다시 정리한다."
        : "이 책의 주장과 ELURA의 타깃을 계속 수정하기 위해 아직 답하지 못한 질문을 남긴다.",
  });
  pages.push(
    ...paginateBlocks(ending.blocks, endingId, {
      chapterId: endingId,
      eyebrow: endingId === "epilogue" ? "에필로그" : "저자의 노트",
      title: ending.title,
    }),
  );
}

const sourceGroups: SourceNote[][] = [];
let sourceGroup: SourceNote[] = [];
let sourceWeight = 0;

for (const note of baseBook.sources) {
  const noteWeight = note.text.length + 180;
  if (sourceGroup.length && sourceWeight + noteWeight > 920) {
    sourceGroups.push(sourceGroup);
    sourceGroup = [];
    sourceWeight = 0;
  }
  sourceGroup.push(note);
  sourceWeight += noteWeight;
}
if (sourceGroup.length) sourceGroups.push(sourceGroup);

sourceGroups.forEach((notes, index) => {
  pages.push({
    id: `sources-${index + 1}`,
    kind: "sources",
    eyebrow: "주석과 출처",
    title: index === 0 ? "본문에 사용한 자료와 출처" : "주석과 출처",
    sourceNotes: notes,
  });
});

pages.push({
  id: "end-colophon",
  kind: "colophon",
  eyebrow: "ELURA",
  title: "Art for the space that is becoming yours.",
  deck:
    "취향을 공간에 풀어내는 시대 · Web Edition 1.1 · 2026. 연구와 원고, 시각 자료는 계속 보완된다. ELURA의 현장 노트는 @elura_studio7에서 이어진다.",
});

export const bookPages = pages;
export const sourceNotes = baseBook.sources;
export { partDefinitions };

const characterCount = chapters.reduce(
  (total, chapter) =>
    total +
    chapter.blocks.reduce((chapterTotal, block) => {
      if (block.type === "paragraph" || block.type === "quote") {
        return chapterTotal + block.text.length;
      }
      if (block.type === "subheading") return chapterTotal + block.text.length;
      if (block.type === "list") {
        return chapterTotal + block.items.join("").length;
      }
      if (block.type === "callout") {
        return chapterTotal + block.label.length + block.text.length;
      }
      return chapterTotal;
    }, 0),
  0,
);

export const bookStats = {
  pageCount: bookPages.length,
  chapterCount: chapterNumber - 1,
  characterCount,
  sourceCount: sourceNotes.length,
};
