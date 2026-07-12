export type TextBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; label: string; text: string }
  | { type: "visual"; visual: VisualKey }
  | { type: "image"; src: string; alt: string; caption?: string };

export type VisualKey =
  | "translation-gap"
  | "pinterest-scale"
  | "choice-overload"
  | "why-now"
  | "women-signal"
  | "life-stage"
  | "market-lab"
  | "translation-matrix"
  | "three-directions"
  | "validation-loop"
  | "reader-workbook";

export type Chapter = {
  id: string;
  title: string;
  deck: string;
  blocks: TextBlock[];
  source?: "base" | "expanded";
};

export type PartDefinition = {
  id: string;
  number: number;
  title: string;
  deck: string;
  chapterIds: string[];
  image?: string;
};

export type SourceNote = {
  number: number;
  text: string;
  links: Array<{ label: string; url: string }>;
};

export type ReaderPage = {
  id: string;
  kind:
    | "cover"
    | "colophon"
    | "contents"
    | "part"
    | "chapter-title"
    | "reading"
    | "visual"
    | "image"
    | "sources";
  partId?: string;
  chapterId?: string;
  partNumber?: number;
  chapterNumber?: number;
  eyebrow?: string;
  title?: string;
  deck?: string;
  blocks?: TextBlock[];
  image?: string;
  imageAlt?: string;
  sourceNotes?: SourceNote[];
};
