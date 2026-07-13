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
    <FigureShell eyebrow="공간 점검" title="구매하기 전에 원인과 방법을 나눠 본다">
      <div className="gap-flow">
        <div className="flow-node tone-coral">
          <CircleUserRound aria-hidden="true" />
          <strong>지금 불편한 점</strong>
          <span>동선 · 빛 · 수납 · 시선 · 익숙함</span>
        </div>
        <div className="flow-bridge">
          <span>물건을 사기 전에</span>
          <b>원인을 먼저 확인한다</b>
          <span>필요하지 않으면 추가하지 않는다</span>
        </div>
        <div className="flow-node tone-jade">
          <Frame aria-hidden="true" />
          <strong>가능한 변화</strong>
          <span>재배치 · 비우기 · 조명 · 패브릭 · 아트</span>
        </div>
      </div>
      <p className="visual-thesis">
        아트는 여러 방법 가운데 하나다. 공간에 필요한 역할이 분명할 때만
        선택한다.
      </p>
    </FigureShell>
  );
}

function PinterestScale() {
  return (
    <FigureShell
      eyebrow="저장 행동"
      title="저장은 여러 도구와 목적에 흩어져 있다"
    >
      <div className="stat-triptych">
        <div className="stat-block tone-ink">
          <Bookmark aria-hidden="true" />
          <strong>북마크</strong>
          <span>읽을 글 · 업무 자료 · 참고 링크</span>
        </div>
        <div className="stat-block tone-coral">
          <MapPin aria-hidden="true" />
          <strong>장소</strong>
          <span>여행 · 식당 · 생활 정보</span>
        </div>
        <div className="stat-block tone-jade">
          <PackageCheck aria-hidden="true" />
          <strong>위시리스트</strong>
          <span>선물 · 비교 · 구매 후보</span>
        </div>
      </div>
      <p className="visual-thesis">
        저장했다는 사실만으로 구매 의사나 인테리어 취향을 단정할 수 없다.
        이번 선택에 쓸 자료는 사용자가 직접 골라야 한다.
      </p>
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
      eyebrow="선택이 어려워지는 조건"
      title="결과가 많을수록 비교할 항목도 늘어난다"
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
        AI는 결과를 늘린다. 서비스는 비교할 몇 개를 고르고 제안 이유를
        보여 줘야 한다.
      </p>
    </FigureShell>
  );
}

function WhyNow() {
  const items = [
    [Bookmark, "참고 자료를 직접 고른다", "사진과 글 가운데 필요한 자료만 선택한다"],
    [ScanLine, "AI가 공간 조건을 비교한다", "벽의 비율과 주변 색, 참고 자료를 함께 본다"],
    [Factory, "한 점씩 제작할 수 있다", "재고 없이 주문 뒤 생산할 수 있다"],
    [ListFilter, "선택지를 몇 개로 줄인다", "아트가 필요한 경우에만 이유와 함께 제안한다"],
  ];
  return (
    <FigureShell
      eyebrow="서비스가 가능한 이유"
      title="선택한 자료와 실제 공간을 함께 비교할 조건이 갖춰졌다"
    >
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
        <strong>조건을 반영한 제안</strong>
        <span />
      </div>
    </FigureShell>
  );
}

function WomenSignal() {
  return (
    <FigureShell
      eyebrow="첫 고객 가설"
      title="왜 첫 조사 대상을 여성으로 정했나"
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
        여성이 특정 미감을 타고났다는 뜻이 아니다. 현재 공개 자료에서 이미지
        저장과 독립적인 주거 결정을 하는 여성을 모집하기 쉽다는 뜻이다.
      </p>
    </FigureShell>
  );
}

function LifeStage() {
  const events = ["독립", "장기 임대", "동거", "첫 자가", "이별", "재택근무", "재정착"];
  return (
    <FigureShell eyebrow="고객 기준" title="나이보다 이사와 독립이 구매 시점을 더 잘 설명한다">
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
          최근 이사·독립·동거·이별을 겪었고, 좋아하는 이미지는 많지만 실제
          작품은 고르지 못한 도시 생활자
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
      title="왜 미국·캐나다·영국부터 비교하나"
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
        세 나라는 영어를 공유하지만 주거 형태와 구매 습관이 달라 같은 제품을
        비교하기 좋다.
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
    <FigureShell eyebrow="작품 구성 기준" title="입력 자료에서 색과 선, 밝기와 반복을 찾는다">
      <div className="matrix-head">
        <span>사용자가 준 자료</span>
        <span>작품에서 조정할 요소</span>
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
    [Brain, "개인 자료 우선", "입력 자료를 가장 많이 반영", "장소와 음악, 기억에서 찾은 요소를 가장 강하게"],
    [Box, "현재 방 우선", "방과 가장 잘 어울림", "빛과 벽 크기, 기존 가구를 가장 많이 반영"],
    [Sparkles, "새로운 제안", "기존 취향을 한 단계 확장", "전에 고르지 않은 색이나 구성을 하나 추가"],
  ];
  return (
    <FigureShell eyebrow="결과 수 가설" title="결과는 왜 세 개가 적당한가">
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
        세 개는 한 화면에서 차이와 이유를 비교할 수 있다고 본 현재의 제품
        가설이다. 사용자 테스트에 따라 바꿀 수 있다.
      </p>
    </FigureShell>
  );
}

function ValidationLoop() {
  const steps = ["관찰", "가설", "비교 테스트", "실제 선택", "수령 뒤 검증", "수정"];
  return (
    <FigureShell eyebrow="검증 원칙" title="고객 가설은 데이터에 따라 바꾼다">
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
          <b>계속 확인할 문제</b> 좋아하는 이미지는 많지만 실제 작품은 고르기 어렵다
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
    <FigureShell eyebrow="내 방 점검" title="반복해서 좋아한 것부터 적어 본다">
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
          <span>방에 이미 있는 조건</span>
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
