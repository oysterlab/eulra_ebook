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
    "기능적으로 완성된 방이 정서적으로 미완성인 이유를 묻고, 번역되지 않은 집이라는 이름을 붙인다.",
  "base-02":
    "집이 주소와 자산을 넘어 가장 큰 자기소개가 된 과정을 장소 정체성과 자기표현의 관점에서 살핀다.",
  "base-03":
    "첫 집을 소유권이 아니라 의도성으로 다시 정의하고, 생애 전환이 공간의 의미를 어떻게 낡게 만드는지 본다.",
  "base-04":
    "시각 플랫폼이 취향 발견을 민주화한 성취와, 그 성공이 만들어 낸 적용의 공백을 함께 읽는다.",
  "base-05":
    "스타일이라는 유용한 압축이 언제 사람의 복잡한 취향을 카탈로그의 평균으로 되돌리는지 묻는다.",
  "base-06":
    "정체성 단서, 실제 공간, 선택의 확신을 연결하는 공간번역의 세 층을 처음으로 완전히 제시한다.",
  "base-07":
    "이미지, 음악, 장소와 물건에 남은 취향의 자취가 설문보다 풍부한 대화의 출발점이 되는 변화를 다룬다.",
  "base-08":
    "멀티모달 AI가 실제 방과 참고 이미지를 함께 다룰 수 있게 된 가능성과, 결코 대신할 수 없는 의미 판단을 구분한다.",
  "base-09":
    "주문형 생산이 개인화된 이미지를 화면에서 배송 가능한 물건으로 옮기며 바꾼 경제적 조건을 살핀다.",
  "base-10":
    "만들기 쉬워진 시대에 왜 고르기는 더 어려워지는지, 선택 과잉의 조건과 큐레이션의 역할을 설명한다.",
  "base-11":
    "여성이라는 범주를 본질로 사용하지 않고, 초기 행동이 더 선명하게 관찰되는 하나의 시장 신호로 읽는다.",
  "base-12":
    "나이를 달력으로, 전환을 동사로 구분하며 이사와 동거, 이별과 재택근무가 만드는 실제 구매 순간을 찾는다.",
  "base-13":
    "미국, 캐나다, 영국을 보편적 정답이 아니라 하나의 가설을 비교적 적은 번역 비용으로 시험할 세 실험실로 본다.",
  "base-14":
    "장소와 음악, 기억과 색을 물체로 복사하지 않고 빛과 리듬, 밀도와 비율의 언어로 옮기는 과정을 따라간다.",
  "base-15":
    "하나의 판정과 무한한 방치 사이에서 세 가지 해석을 제안하고, ELURA가 검증하려는 경험을 구체화한다.",
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
    title: "공간번역의 시대",
    deck: "취향은 넘치는데, 왜 집은 아직 나를 닮지 못하는가",
    image: "images/cover.jpg",
    imageAlt:
      "책과 음반, 열쇠가 놓인 도시의 거실과 큰 추상 작품이 걸린 벽",
  },
  {
    id: "thesis",
    kind: "colophon",
    eyebrow: "이 책의 명제",
    title: "영감은 풍요로워졌고, 번역은 가난해졌다.",
    deck:
      "우리는 취향이 없어서 남의 집을 닮는 것이 아니다. 취향을 발견하는 도구는 넘치지만, 그것을 공간으로 번역하는 도구가 없어서다.",
  },
  {
    id: "publication-note",
    kind: "colophon",
    eyebrow: "출간 노트",
    title: "정답을 가르치지 않고, 변화에 이름을 붙인다.",
    deck:
      "이 책은 인테리어 교본이 아니다. 집, 취향, 기술, 생산이 만나는 자리에서 아직 이름 붙지 않은 변화를 추적하는 문화비평이자 제품 가설이다. 가상 사례는 실제 인터뷰와 구분했고, 사실 주장에는 출처를 연결했다.",
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
      "모든 것이 갖춰진 방의 빈 벽에서, 집을 채우는 일과 집에 내가 드러나는 일이 왜 다른지 묻는다.",
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
        ? "빈 벽으로 돌아가, 유행이 아니라 자신이 반복해서 사랑해 온 것을 묻는다."
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
    title: index === 0 ? "자료가 말한 것과 우리가 해석한 것" : "주석과 출처",
    sourceNotes: notes,
  });
});

pages.push({
  id: "end-colophon",
  kind: "colophon",
  eyebrow: "ELURA",
  title: "Art for the space that is becoming yours.",
  deck:
    "공간번역의 시대 · Web Edition 1.0 · 2026. 연구와 원고, 시각 자료는 계속 보완된다. ELURA의 현장 노트는 @elura_studio7에서 이어진다.",
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
