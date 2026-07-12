"use client";

import {
  Bookmark,
  Box,
  Brain,
  Check,
  CircleUserRound,
  Factory,
  Frame,
  ListFilter,
  MapPin,
  PackageCheck,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { VisualKey } from "../lib/book-types";

type Props = { visual: VisualKey };

const FigureShell = ({
  eyebrow,
  title,
  children,
  source,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  source?: string;
}) => (
  <figure className="visual-essay" aria-label={`${eyebrow}: ${title}`}>
    <figcaption>
      <span>{eyebrow}</span>
      <h3>{title}</h3>
    </figcaption>
    <div className="visual-body">{children}</div>
    {source ? <p className="visual-source">{source}</p> : null}
  </figure>
);

function TranslationGap() {
  return (
    <FigureShell eyebrow="핵심 모델" title="번역의 공백은 어디에 있는가">
      <div className="gap-flow">
        <div className="flow-node tone-coral">
          <CircleUserRound aria-hidden="true" />
          <strong>정체성 단서</strong>
          <span>장소 · 음악 · 기억 · 색 · 물건</span>
        </div>
        <div className="flow-bridge">
          <span>발견은 많고</span>
          <b>번역은 비어 있다</b>
          <span>결정은 어렵다</span>
        </div>
        <div className="flow-node tone-jade">
          <Frame aria-hidden="true" />
          <strong>실제 공간</strong>
          <span>빛 · 비율 · 가구 · 재료 · 예산</span>
        </div>
      </div>
      <p className="visual-thesis">
        영감은 무엇을 좋아할 수 있는지 보여 준다. 번역은 무엇이 이 사람의
        이 방에 속하는지 결정한다.
      </p>
    </FigureShell>
  );
}

function PinterestScale() {
  return (
    <FigureShell
      eyebrow="시대의 신호"
      title="취향은 이미 거대한 흔적을 남긴다"
      source="Pinterest Q1 2026 Earnings Presentation 〔6〕"
    >
      <div className="stat-triptych">
        <div className="stat-block tone-ink">
          <Bookmark aria-hidden="true" />
          <strong>6억 3,100만</strong>
          <span>월간 활성 이용자</span>
        </div>
        <div className="stat-block tone-coral">
          <ScanLine aria-hidden="true" />
          <strong>800억+</strong>
          <span>월간 검색</span>
        </div>
        <div className="stat-block tone-jade">
          <PackageCheck aria-hidden="true" />
          <strong>약 절반</strong>
          <span>상업적 성격의 검색</span>
        </div>
      </div>
      <div className="quarter-bars" aria-label="Pinterest 월간 활성 이용자 추이">
        {[
          ["Q1 ’25", 570],
          ["Q2", 578],
          ["Q3", 600],
          ["Q4", 619],
          ["Q1 ’26", 631],
        ].map(([label, value]) => (
          <div className="quarter-bar" key={label}>
            <span style={{ height: `${Number(value) - 500}px` }} />
            <b>{value}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </FigureShell>
  );
}

function ChoiceOverload() {
  const factors = [
    ["선택지 복잡성", "비교해야 할 속성이 많다"],
    ["결정 난도", "실제 방을 함께 상상해야 한다"],
    ["선호 불확실성", "정답이 없고 취향을 확신하기 어렵다"],
    ["결정 목표", "오래 함께 살 하나를 골라야 한다"],
  ];
  return (
    <FigureShell
      eyebrow="선택 빈곤"
      title="결과가 많아서가 아니라, 비교가 복잡해서 멈춘다"
      source="Choice overload meta-analysis, 2015 〔10〕"
    >
      <div className="choice-axis">
        <span>가능성</span>
        <div className="choice-line">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <span>결정</span>
      </div>
      <div className="factor-grid">
        {factors.map(([title, body], index) => (
          <div key={title} className={`factor factor-${index + 1}`}>
            <b>0{index + 1}</b>
            <strong>{title}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="visual-thesis">
        무한 생성은 가능성을 늘린다. 큐레이션은 선택의 기준을 만든다.
      </p>
    </FigureShell>
  );
}

function WhyNow() {
  const items = [
    [Bookmark, "취향이 보인다", "저장과 검색, 사진과 음악이 단서를 남긴다"],
    [ScanLine, "방을 읽는다", "이미지와 언어를 한 흐름에서 다룬다"],
    [Factory, "하나도 만든다", "재고 없이 주문 뒤 생산할 수 있다"],
    [ListFilter, "가능성을 줄인다", "무한 결과를 선택 가능한 방향으로 만든다"],
  ];
  return (
    <FigureShell eyebrow="WHY NOW" title="네 개의 변화가 같은 시기에 만났다">
      <div className="why-grid">
        {items.map(([Icon, title, body], index) => {
          const VisualIcon = Icon as typeof Bookmark;
          return (
            <div className={`why-card why-${index + 1}`} key={String(title)}>
              <VisualIcon aria-hidden="true" />
              <b>{String(title)}</b>
              <span>{String(body)}</span>
            </div>
          );
        })}
      </div>
      <div className="convergence-line">
        <span />
        <strong>공간번역</strong>
        <span />
      </div>
    </FigureShell>
  );
}

function WomenSignal() {
  return (
    <FigureShell
      eyebrow="초기 고객 신호"
      title="여성은 시장의 경계가 아니라 관찰의 출발점이다"
      source="Pinterest Audience 〔11〕 · NAR 2025 Profile 〔12〕"
    >
      <div className="signal-columns">
        <div className="signal-panel">
          <span>시각 탐색 채널의 구성</span>
          <div className="stacked-bar" aria-label="Pinterest 이용자 성별 구성">
            <i style={{ width: "70%" }}>여성 70%</i>
            <i style={{ width: "30%" }}>남성 30%</i>
          </div>
          <small>플랫폼이 공개한 두 범주의 전 세계 수치</small>
        </div>
        <div className="signal-panel">
          <span>미국 첫 주택 구매자</span>
          <div className="compare-bars">
            <div>
              <b>싱글 여성</b>
              <i style={{ width: "100%" }}>25%</i>
            </div>
            <div>
              <b>싱글 남성</b>
              <i style={{ width: "40%" }}>10%</i>
            </div>
          </div>
          <small>주택 구매자 자료이며 임차인이나 다른 국가를 대표하지 않음</small>
        </div>
      </div>
      <p className="visual-thesis">
        성별을 미감의 원인으로 사용하지 않는다. 행동을 더 잘 관찰할 수 있는
        초기 렌즈로 사용한다.
      </p>
    </FigureShell>
  );
}

function LifeStage() {
  const events = ["독립", "장기 임대", "동거", "첫 자가", "이별", "재택근무", "재정착"];
  return (
    <FigureShell eyebrow="타깃 재정의" title="나이는 달력이고, 전환은 동사다">
      <div className="life-track">
        {events.map((event, index) => (
          <div key={event} className={index % 2 ? "life-event lower" : "life-event"}>
            <i />
            <span>{event}</span>
          </div>
        ))}
      </div>
      <div className="life-definition">
        <CircleUserRound aria-hidden="true" />
        <p>
          <b>핵심 고객</b>
          주거 전환기에 있으며, 취향의 단서는 충분하지만 실제 방의 결정으로
          옮기지 못하는 도시 생활자
        </p>
      </div>
    </FigureShell>
  );
}

function MarketLab() {
  const markets = [
    ["미국", "16.9%", "전자상거래의 소매 비중", "규모와 도시 다양성"],
    ["캐나다", "+9.0%", "2024 전자상거래 매출 성장", "주거비와 콘도 생활"],
    ["영국", "27.5%", "인터넷 소매 판매 비중", "플랫과 현지 규격"],
  ];
  return (
    <FigureShell
      eyebrow="출시 시장 가설"
      title="세 나라는 정답이 아니라 비교 실험실이다"
      source="U.S. Census 〔14〕 · Statistics Canada 〔15〕 · ONS 〔16〕"
    >
      <div className="market-grid">
        {markets.map(([country, stat, label, test], index) => (
          <div className={`market-card market-${index + 1}`} key={country}>
            <MapPin aria-hidden="true" />
            <strong>{country}</strong>
            <b>{stat}</b>
            <span>{label}</span>
            <small>검증할 것 · {test}</small>
          </div>
        ))}
      </div>
      <p className="visual-thesis">
        국가는 운영의 단위다. 도시는 생활의 단위이고, 방은 결정의 단위다.
      </p>
    </FigureShell>
  );
}

function TranslationMatrix() {
  const rows = [
    ["장소", "빛 · 온도 · 재료 · 여백"],
    ["음악", "리듬 · 반복 · 밀도 · 대비"],
    ["기억", "거리 · 시점 · 상징 · 감정의 강도"],
    ["색", "팔레트 · 면적 · 강조점 · 주변과의 관계"],
    ["소중한 물건", "형태 · 질감 · 비례 · 배치의 중심"],
  ];
  return (
    <FigureShell eyebrow="번역 매트릭스" title="명사를 복사하지 않고 관계를 옮긴다">
      <div className="matrix-head">
        <span>사람의 언어</span>
        <span>공간의 언어</span>
      </div>
      <div className="matrix-rows">
        {rows.map(([from, to], index) => (
          <div className={`matrix-row matrix-${index + 1}`} key={from}>
            <b>{from}</b>
            <i />
            <span>{to}</span>
          </div>
        ))}
      </div>
    </FigureShell>
  );
}

function ThreeDirections() {
  const directions = [
    [Brain, "기억에 가까운 방향", "나를 알아본다", "단서의 정서와 이야기를 가장 충실하게"],
    [Box, "방에 가까운 방향", "여기에 속한다", "빛과 비율, 기존 가구와 가장 자연스럽게"],
    [Sparkles, "가능성에 가까운 방향", "이것도 나일 수 있다", "말하지 못한 취향을 근거 있게 한 걸음 확장"],
  ];
  return (
    <FigureShell eyebrow="큐레이션된 확신" title="하나는 판정이고, 무한은 방치다">
      <div className="direction-grid">
        {directions.map(([Icon, title, quoteText, body], index) => {
          const VisualIcon = Icon as typeof Brain;
          return (
            <div className={`direction-card direction-${index + 1}`} key={String(title)}>
              <VisualIcon aria-hidden="true" />
              <b>{String(title)}</b>
              <strong>“{String(quoteText)}”</strong>
              <span>{String(body)}</span>
            </div>
          );
        })}
      </div>
      <p className="visual-thesis">
        세 개는 진리의 숫자가 아니다. 차이를 느끼면서도 비교할 수 있는 현재의
        제품 가설이다.
      </p>
    </FigureShell>
  );
}

function ValidationLoop() {
  const steps = ["관찰", "가설", "비교 테스트", "실제 선택", "수령 뒤 검증", "수정"];
  return (
    <FigureShell eyebrow="검증 원칙" title="타깃은 틀릴 수 있게 써 놓은 예측이다">
      <div className="validation-loop">
        {steps.map((step, index) => (
          <div key={step}>
            <span>{index + 1}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>
      <div className="validation-rule">
        <Check aria-hidden="true" />
        <p>
          <b>바꾸지 않을 것</b> 취향과 방 사이의 번역 문제
          <br />
          <b>바꿀 수 있는 것</b> 성별 · 연령 · 국가 · 채널 · 선택지 수
        </p>
      </div>
    </FigureShell>
  );
}

function ReaderWorkbook() {
  const [answers, setAnswers] = useState({ scene: "", room: "", color: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("elura-workbook");
      if (!stored) return;
      try {
        setAnswers(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem("elura-workbook");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const update = (key: keyof typeof answers, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    window.localStorage.setItem("elura-workbook", JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  return (
    <FigureShell eyebrow="나의 공간번역 노트" title="정답 대신 관찰을 저장한다">
      <div className="workbook-fields">
        <label>
          <span>반복해서 사랑한 장면</span>
          <textarea
            value={answers.scene}
            onChange={(event) => update("scene", event.target.value)}
            placeholder="장소보다 빛, 소리, 온도, 속도를 적어 보세요."
          />
        </label>
        <label>
          <span>방이 이미 말하고 있는 것</span>
          <textarea
            value={answers.room}
            onChange={(event) => update("room", event.target.value)}
            placeholder="선, 그림자, 반복되는 물건을 적어 보세요."
          />
        </label>
        <label>
          <span>가져오고 싶은 색의 기억</span>
          <textarea
            value={answers.color}
            onChange={(event) => update("color", event.target.value)}
            placeholder="색 이름보다 그 색을 보았던 장면을 적어 보세요."
          />
        </label>
      </div>
      <div className="save-state" aria-live="polite">
        {saved ? "이 기기에 저장됨" : "답변은 이 기기에만 저장됩니다."}
      </div>
    </FigureShell>
  );
}

export function VisualEssay({ visual }: Props) {
  switch (visual) {
    case "translation-gap":
      return <TranslationGap />;
    case "pinterest-scale":
      return <PinterestScale />;
    case "choice-overload":
      return <ChoiceOverload />;
    case "why-now":
      return <WhyNow />;
    case "women-signal":
      return <WomenSignal />;
    case "life-stage":
      return <LifeStage />;
    case "market-lab":
      return <MarketLab />;
    case "translation-matrix":
      return <TranslationMatrix />;
    case "three-directions":
      return <ThreeDirections />;
    case "validation-loop":
      return <ValidationLoop />;
    case "reader-workbook":
      return <ReaderWorkbook />;
  }
}
