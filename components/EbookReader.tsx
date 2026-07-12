"use client";

/* eslint-disable @next/next/no-img-element */

import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns2,
  ExternalLink,
  Menu,
  Moon,
  Printer,
  Rows3,
  Search,
  SlidersHorizontal,
  Sun,
  SunMedium,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bookPages, bookStats, chapters, partDefinitions } from "../lib/book";
import type { ReaderPage, TextBlock } from "../lib/book-types";
import { VisualEssay } from "./VisualEssay";

const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
const orderedChapters = partDefinitions.flatMap((part) =>
  part.chapterIds.map((id) => ({ part, chapter: chapterMap.get(id)! })),
);

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(〔\d+〕)/g);
  return parts.map((part, index) => {
    const match = part.match(/^〔(\d+)〕$/);
    if (!match) return <span key={`${part}-${index}`}>{part}</span>;
    return (
      <a
        className="footnote-link"
        href={`#source-note-${match[1]}`}
        key={`${part}-${index}`}
        aria-label={`주석 ${match[1]}로 이동`}
      >
        {part}
      </a>
    );
  });
}

function RenderBlock({ block }: { block: TextBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="reading-paragraph">
          <InlineText text={block.text} />
        </p>
      );
    case "quote":
      return (
        <blockquote className="reading-quote">
          <InlineText text={block.text} />
        </blockquote>
      );
    case "subheading":
      return <h3 className="reading-subheading">{block.text}</h3>;
    case "list":
      return (
        <ul className="reading-list">
          {block.items.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="reading-callout">
          <strong>{block.label}</strong>
          <p>{block.text}</p>
        </aside>
      );
    case "visual":
      return <VisualEssay visual={block.visual} />;
    case "image":
      return null;
  }
}

function PageFooter({ number }: { number: number }) {
  return (
    <footer className="page-footer" aria-hidden="true">
      <span>ELURA</span>
      <b>{String(number).padStart(3, "0")}</b>
    </footer>
  );
}

function CoverPage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page cover-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <img src={page.image} alt={page.imageAlt ?? ""} />
      <div className="cover-shade" />
      <div className="cover-copy">
        <span>{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.deck}</p>
        <div className="cover-meta">
          <b>WEB EDITION 1.0</b>
          <b>{bookStats.pageCount} PAGES</b>
        </div>
      </div>
      <a
        className="cover-start"
        href="#thesis"
      >
        읽기 시작
        <ChevronDown aria-hidden="true" />
      </a>
      <PageFooter number={number} />
    </article>
  );
}

function ColophonPage({ page, number }: { page: ReaderPage; number: number }) {
  const isEnd = page.id === "end-colophon";
  return (
    <article
      className={`book-page colophon-page ${isEnd ? "end-colophon" : ""}`}
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <div className="colophon-mark">
        <BookOpen aria-hidden="true" />
      </div>
      <div className="colophon-copy">
        <span className="page-eyebrow">{page.eyebrow}</span>
        <h2>{page.title}</h2>
        <p>{page.deck}</p>
        {isEnd ? (
          <a
            className="studio-link"
            href="https://www.tiktok.com/@elura_studio7"
            target="_blank"
            rel="noreferrer"
          >
            @elura_studio7
            <ExternalLink aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <PageFooter number={number} />
    </article>
  );
}

function ContentsPage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page contents-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <header className="page-title-block">
        <span className="page-eyebrow">{page.eyebrow}</span>
        <h2>{page.title}</h2>
      </header>
      <div className="contents-list">
        {page.blocks?.map((block) =>
          block.type === "callout" ? (
            <section key={block.label}>
              <h3>{block.label}</h3>
              <p>{block.text}</p>
            </section>
          ) : null,
        )}
      </div>
      <PageFooter number={number} />
    </article>
  );
}

function PartPage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page part-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <img src={page.image} alt={page.imageAlt ?? ""} />
      <div className="part-overlay" />
      <div className="part-copy">
        <span>{page.eyebrow}</span>
        <h2>{page.title}</h2>
        <p>{page.deck}</p>
      </div>
      <PageFooter number={number} />
    </article>
  );
}

function ChapterTitlePage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page chapter-title-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <div className="chapter-index">{page.eyebrow}</div>
      <div className="chapter-title-copy">
        <h2>{page.title}</h2>
        <p>{page.deck}</p>
      </div>
      <div className="chapter-rule" />
      <PageFooter number={number} />
    </article>
  );
}

function ReadingPage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page reading-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <header className="running-head">
        <span>{page.eyebrow}</span>
        <strong>{page.title}</strong>
      </header>
      <div className="reading-body">
        {page.blocks?.map((block, index) => (
          <RenderBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>
      <PageFooter number={number} />
    </article>
  );
}

function VisualPage({ page, number }: { page: ReaderPage; number: number }) {
  const visual = page.blocks?.find((block) => block.type === "visual");
  return (
    <article
      className="book-page visual-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <header className="running-head">
        <span>{page.eyebrow}</span>
        <strong>{page.title}</strong>
      </header>
      {visual?.type === "visual" ? <VisualEssay visual={visual.visual} /> : null}
      <PageFooter number={number} />
    </article>
  );
}

function ImagePage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page image-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <img src={page.image} alt={page.imageAlt ?? ""} />
      {page.deck ? <p>{page.deck}</p> : null}
      <PageFooter number={number} />
    </article>
  );
}

function SourcesPage({ page, number }: { page: ReaderPage; number: number }) {
  return (
    <article
      className="book-page sources-page"
      id={page.id}
      data-reader-page
      data-page-index={number - 1}
    >
      <header className="page-title-block">
        <span className="page-eyebrow">{page.eyebrow}</span>
        <h2>{page.title}</h2>
      </header>
      <ol className="source-list">
        {page.sourceNotes?.map((note) => (
          <li id={`source-note-${note.number}`} key={note.number}>
            <b>{note.number}</b>
            <p>{note.text}</p>
            <div>
              {note.links.map((link) => (
                <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
                  {link.label}
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <PageFooter number={number} />
    </article>
  );
}

function ReaderPageView({
  page,
  number,
}: {
  page: ReaderPage;
  number: number;
}) {
  switch (page.kind) {
    case "cover":
      return <CoverPage page={page} number={number} />;
    case "colophon":
      return <ColophonPage page={page} number={number} />;
    case "contents":
      return <ContentsPage page={page} number={number} />;
    case "part":
      return <PartPage page={page} number={number} />;
    case "chapter-title":
      return <ChapterTitlePage page={page} number={number} />;
    case "reading":
      return <ReadingPage page={page} number={number} />;
    case "visual":
      return <VisualPage page={page} number={number} />;
    case "image":
      return <ImagePage page={page} number={number} />;
    case "sources":
      return <SourcesPage page={page} number={number} />;
  }
}

export function EbookReader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontScale, setFontScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPage, setSavedPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState<"paged" | "scroll">("paged");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [brightness, setBrightness] = useState(1);
  const [brightnessHud, setBrightnessHud] = useState(false);
  const initialized = useRef(false);
  const bookReaderRef = useRef<HTMLElement>(null);
  const hudTimerRef = useRef<number | null>(null);
  const lastTouchAtRef = useRef(0);
  const gestureRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startedAt: 0,
    startBrightness: 1,
    brightnessEdge: false,
    kind: "idle" as "idle" | "page" | "brightness" | "scroll",
  });
  const mobilePaged = isMobile && mobileMode === "paged";

  const goToPage = useCallback((index: number) => {
    const next = Math.min(bookPages.length - 1, Math.max(0, index));
    setCurrentPage(next);
    window.localStorage.setItem("elura-last-page", String(next));
    window.requestAnimationFrame(() => {
      bookReaderRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 44rem)");
    const handleMobileChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    mobileQuery.addEventListener("change", handleMobileChange);

    const frame = window.requestAnimationFrame(() => {
      setIsMobile(mobileQuery.matches);

      const storedTheme = window.localStorage.getItem("elura-theme") as
        | "light"
        | "dark"
        | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(storedTheme ?? (prefersDark ? "dark" : "light"));

      const storedScale = Number(window.localStorage.getItem("elura-font-scale"));
      if (storedScale >= 0.9 && storedScale <= 1.2) setFontScale(storedScale);

      const storedPage = Number(window.localStorage.getItem("elura-last-page"));
      if (storedPage > 0 && storedPage < bookPages.length) setSavedPage(storedPage);

      const storedMode = window.localStorage.getItem("elura-mobile-mode");
      if (storedMode === "scroll" || storedMode === "paged") {
        setMobileMode(storedMode);
      }

      const storedBrightness = Number(window.localStorage.getItem("elura-brightness"));
      if (storedBrightness >= 0.55 && storedBrightness <= 1) {
        setBrightness(storedBrightness);
      }
      initialized.current = true;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (initialized.current) window.localStorage.setItem("elura-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--reader-scale", String(fontScale));
    if (initialized.current) {
      window.localStorage.setItem("elura-font-scale", String(fontScale));
    }
  }, [fontScale]);

  useEffect(() => {
    if (initialized.current) {
      window.localStorage.setItem("elura-mobile-mode", mobileMode);
    }
  }, [mobileMode]);

  useEffect(() => {
    if (initialized.current) {
      window.localStorage.setItem("elura-brightness", String(brightness));
    }
  }, [brightness]);

  useEffect(() => {
    return () => {
      if (hudTimerRef.current) window.clearTimeout(hudTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (mobilePaged) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.pageIndex);
        setCurrentPage(index);
        window.localStorage.setItem("elura-last-page", String(index));
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.1, 0.25, 0.5] },
    );

    document.querySelectorAll("[data-reader-page]").forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, [mobilePaged]);

  useEffect(() => {
    if (!mobilePaged) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToPage(currentPage - 1);
      }
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goToPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, goToPage, mobilePaged]);

  const filteredChapters = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ko");
    if (!needle) return orderedChapters;
    return orderedChapters.filter(({ chapter, part }) =>
      `${chapter.title} ${chapter.deck} ${part.title}`.toLocaleLowerCase("ko").includes(needle),
    );
  }, [query]);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (mobilePaged) {
      const page = target?.closest<HTMLElement>("[data-reader-page]");
      const index = Number(page?.dataset.pageIndex);
      if (Number.isFinite(index)) goToPage(index);
    } else {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSidebarOpen(false);
    setSettingsOpen(false);
  };

  const showBrightnessHud = () => {
    setBrightnessHud(true);
    if (hudTimerRef.current) window.clearTimeout(hudTimerRef.current);
    hudTimerRef.current = window.setTimeout(() => setBrightnessHud(false), 700);
  };

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    Boolean(target.closest("a, button, input, textarea, select, [role='button']"));

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    if (!mobilePaged || event.touches.length !== 1 || isInteractiveTarget(event.target)) return;
    lastTouchAtRef.current = Date.now();
    const touch = event.touches[0];
    gestureRef.current = {
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      startedAt: Date.now(),
      startBrightness: brightness,
      brightnessEdge: touch.clientX >= window.innerWidth * 0.82,
      kind: "idle",
    };
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!mobilePaged || !gesture.active || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const dx = touch.clientX - gesture.startX;
    const dy = touch.clientY - gesture.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (gesture.kind === "idle" && Math.max(absX, absY) > 8) {
      if (gesture.brightnessEdge && absY > absX * 1.1) {
        gesture.kind = "brightness";
      } else if (absX > absY * 1.15) {
        gesture.kind = "page";
      } else if (absY > 8) {
        gesture.kind = "scroll";
      }
    }

    if (gesture.kind === "brightness") {
      event.preventDefault();
      const next = Math.min(
        1,
        Math.max(0.55, gesture.startBrightness + (gesture.startY - touch.clientY) / 420),
      );
      setBrightness(next);
      showBrightnessHud();
    } else if (gesture.kind === "page") {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: ReactTouchEvent<HTMLElement>) => {
    const gesture = gestureRef.current;
    if (!mobilePaged || !gesture.active) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - gesture.startX;
    const dy = touch.clientY - gesture.startY;

    if (gesture.kind === "page" && Math.abs(dx) > 44) {
      goToPage(currentPage + (dx < 0 ? 1 : -1));
    } else if (
      gesture.kind === "idle" &&
      Math.max(Math.abs(dx), Math.abs(dy)) < 9 &&
      Date.now() - gesture.startedAt < 450
    ) {
      if (touch.clientX < window.innerWidth * 0.34) {
        goToPage(currentPage - 1);
      } else if (touch.clientX > window.innerWidth * 0.66) {
        goToPage(currentPage + 1);
      } else {
        setControlsVisible((visible) => !visible);
        setSettingsOpen(false);
      }
    } else if (gesture.kind === "brightness") {
      showBrightnessHud();
    }

    gesture.active = false;
    gesture.kind = "idle";
  };

  const handleBookClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (!mobilePaged) return;
    const target = event.target as HTMLElement;
    const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor) {
      event.preventDefault();
      scrollTo(anchor.getAttribute("href")!.slice(1));
      return;
    }
    if (isInteractiveTarget(target) || Date.now() - lastTouchAtRef.current < 700) return;

    if (event.clientX < window.innerWidth * 0.34) {
      goToPage(currentPage - 1);
    } else if (event.clientX > window.innerWidth * 0.66) {
      goToPage(currentPage + 1);
    } else {
      setControlsVisible((visible) => !visible);
      setSettingsOpen(false);
    }
  };

  const setReadingMode = (mode: "paged" | "scroll") => {
    setMobileMode(mode);
    setControlsVisible(true);
    setSettingsOpen(false);
    if (mode === "scroll") {
      window.requestAnimationFrame(() => {
        document.getElementById(bookPages[currentPage].id)?.scrollIntoView({ block: "start" });
      });
    }
  };

  const progress = ((currentPage + 1) / bookPages.length) * 100;

  return (
    <div
      className={`reader-shell ${mobilePaged ? "mobile-paged" : ""} ${
        mobilePaged && !controlsVisible ? "controls-hidden" : ""
      }`}
      style={{ "--reader-brightness": brightness } as CSSProperties}
    >
      <a className="skip-link" href="#book-reader">
        본문으로 이동
      </a>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="reader-toolbar">
        <div className="toolbar-brand">
          <button
            className="icon-button mobile-menu"
            type="button"
            aria-label="목차 열기"
            title="목차"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
          <button type="button" className="brand-button" onClick={() => scrollTo("cover")}>
            <b>ELURA</b>
            <span>취향을 공간에 풀어내는 시대</span>
          </button>
        </div>

        <div className="toolbar-actions">
          <span className="page-status" aria-live="polite">
            {currentPage + 1} / {bookPages.length}
          </span>
          <button
            className="icon-button"
            type="button"
            aria-label="글자 크기 줄이기"
            title="글자 작게"
            disabled={fontScale <= 0.9}
            onClick={() => setFontScale((value) => Math.max(0.9, value - 0.05))}
          >
            <ZoomOut aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="글자 크기 키우기"
            title="글자 크게"
            disabled={fontScale >= 1.2}
            onClick={() => setFontScale((value) => Math.min(1.2, value + 0.05))}
          >
            <ZoomIn aria-hidden="true" />
          </button>
          <button
            className="icon-button desktop-theme-toggle"
            type="button"
            aria-label={theme === "light" ? "어두운 화면" : "밝은 화면"}
            title={theme === "light" ? "다크 모드" : "라이트 모드"}
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <button
            className="icon-button desktop-print-button"
            type="button"
            aria-label="인쇄 또는 PDF 저장"
            title="인쇄 또는 PDF 저장"
            onClick={() => window.print()}
          >
            <Printer aria-hidden="true" />
          </button>
          <button
            className="icon-button mobile-reader-settings"
            type="button"
            aria-label="모바일 독서 설정"
            aria-expanded={settingsOpen}
            title="독서 설정"
            onClick={() => {
              setSettingsOpen((open) => !open);
              setControlsVisible(true);
            }}
          >
            <SlidersHorizontal aria-hidden="true" />
          </button>
        </div>
      </header>

      {isMobile && settingsOpen ? (
        <section className="mobile-settings-panel" aria-label="모바일 독서 설정">
          <header>
            <h2>독서 설정</h2>
            <button
              className="icon-button"
              type="button"
              aria-label="독서 설정 닫기"
              title="닫기"
              onClick={() => setSettingsOpen(false)}
            >
              <X aria-hidden="true" />
            </button>
          </header>
          <div className="mobile-setting-group">
            <span className="mobile-setting-label">읽기 방식</span>
            <div className="reading-mode-control" aria-label="읽기 방식">
              <button
                type="button"
                aria-pressed={mobileMode === "paged"}
                onClick={() => setReadingMode("paged")}
              >
                <Columns2 aria-hidden="true" />
                페이지
              </button>
              <button
                type="button"
                aria-pressed={mobileMode === "scroll"}
                onClick={() => setReadingMode("scroll")}
              >
                <Rows3 aria-hidden="true" />
                스크롤
              </button>
            </div>
          </div>
          <div className="mobile-setting-row">
            <span className="mobile-setting-label">글자 크기</span>
            <div className="font-size-control">
              <button
                className="icon-button"
                type="button"
                aria-label="글자 크기 줄이기"
                title="글자 작게"
                disabled={fontScale <= 0.9}
                onClick={() => setFontScale((value) => Math.max(0.9, value - 0.05))}
              >
                <ZoomOut aria-hidden="true" />
              </button>
              <output>{Math.round(fontScale * 100)}%</output>
              <button
                className="icon-button"
                type="button"
                aria-label="글자 크기 키우기"
                title="글자 크게"
                disabled={fontScale >= 1.2}
                onClick={() => setFontScale((value) => Math.min(1.2, value + 0.05))}
              >
                <ZoomIn aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mobile-setting-group">
            <span className="mobile-setting-label">화면</span>
            <div className="appearance-control" aria-label="화면 모드">
              <button
                type="button"
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
              >
                <Sun aria-hidden="true" />
                밝게
              </button>
              <button
                type="button"
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
              >
                <Moon aria-hidden="true" />
                어둡게
              </button>
            </div>
          </div>
          <label className="brightness-control">
            <SunMedium aria-hidden="true" />
            <span>밝기</span>
            <input
              type="range"
              min="55"
              max="100"
              value={Math.round(brightness * 100)}
              onInput={(event) => {
                setBrightness(Number(event.currentTarget.value) / 100);
                showBrightnessHud();
              }}
            />
            <output>{Math.round(brightness * 100)}%</output>
          </label>
        </section>
      ) : null}

      <aside className={`reader-sidebar ${sidebarOpen ? "open" : ""}`} aria-label="책 목차">
        <div className="sidebar-head">
          <div>
            <span>WEB EDITION 1.0</span>
            <strong>{bookStats.pageCount}쪽 · {bookStats.chapterCount}장</strong>
          </div>
          <button
            className="icon-button sidebar-close"
            type="button"
            aria-label="목차 닫기"
            title="닫기"
            onClick={() => setSidebarOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        {savedPage > 1 ? (
          <button
            className="resume-button"
            type="button"
            onClick={() => scrollTo(bookPages[savedPage]?.id ?? "cover")}
          >
            이어 읽기
            <span>{savedPage + 1}쪽</span>
          </button>
        ) : null}
        <label className="chapter-search">
          <Search aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="목차에서 장 또는 개념 검색"
            placeholder="장 또는 개념 검색"
          />
        </label>
        <nav>
          {partDefinitions.map((part) => {
            const matches = filteredChapters.filter(({ part: candidate }) => candidate.id === part.id);
            if (!matches.length) return null;
            return (
              <section className="toc-part" key={part.id}>
                <button type="button" onClick={() => scrollTo(part.id)}>
                  <span>{part.number}부</span>
                  <strong>{part.title}</strong>
                </button>
                <ol>
                  {matches.map(({ chapter }) => {
                    const number = orderedChapters.findIndex((item) => item.chapter.id === chapter.id) + 1;
                    return (
                      <li key={chapter.id}>
                        <button type="button" onClick={() => scrollTo(`${chapter.id}-title`)}>
                          <span>{String(number).padStart(2, "0")}</span>
                          {chapter.title}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen ? (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="목차 닫기"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {mobilePaged ? <div className="brightness-veil" aria-hidden="true" /> : null}

      {brightnessHud ? (
        <div className="brightness-hud" role="status" aria-live="polite">
          <SunMedium aria-hidden="true" />
          <strong>{Math.round(brightness * 100)}%</strong>
        </div>
      ) : null}

      <main
        className="book-reader"
        id="book-reader"
        ref={bookReaderRef}
        onClick={handleBookClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {bookPages.map((page, index) => (
          <div
            className={`page-slot ${mobilePaged && index === currentPage ? "active" : ""}`}
            aria-hidden={mobilePaged ? index !== currentPage : undefined}
            key={page.id}
          >
            <ReaderPageView page={page} number={index + 1} />
          </div>
        ))}
      </main>

      {mobilePaged ? (
        <nav className="mobile-page-controls" aria-label="페이지 이동">
          <button
            className="icon-button"
            type="button"
            aria-label="이전 페이지"
            title="이전 페이지"
            disabled={currentPage === 0}
            onClick={() => goToPage(currentPage - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <label className="mobile-page-scrubber">
            <output>{currentPage + 1}</output>
            <input
              type="range"
              min="1"
              max={bookPages.length}
              value={currentPage + 1}
              aria-label="페이지 바로 이동"
              onChange={(event) => goToPage(Number(event.currentTarget.value) - 1)}
            />
            <span>{bookPages.length}</span>
          </label>
          <button
            className="icon-button"
            type="button"
            aria-label="다음 페이지"
            title="다음 페이지"
            disabled={currentPage === bookPages.length - 1}
            onClick={() => goToPage(currentPage + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
