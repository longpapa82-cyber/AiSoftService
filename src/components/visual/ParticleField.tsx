import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import styles from './ParticleField.module.css';

/**
 * "Living Silicon" 신경망 파티클 필드 — Hero·Technology·About·Footer 공용 배경 레이어.
 *
 * 노드가 느리게 유영하고, 근접한 노드끼리 연결선을 그려 신경망/회로 인상을 만든다.
 * 포인터(정밀 포인터=마우스) 근처 노드는 살짝 끌려오며 밝아진다("연산 반응").
 * 골드 신호 노드가 맥동하고, 이웃으로 시냅스 펄스를 발사해 "연산 중인 시스템"을 표현한다.
 *
 * 성능 규율(강조형 비주얼 유지하면서 비용만 최소화):
 *  - IntersectionObserver로 뷰포트 밖이면 rAF 정지, 재진입 시 재개.
 *  - document.hidden(탭 숨김) 시 정지.
 *  - [OPT-1] 백킹 픽셀 예산제 — 큰 섹션은 effDpr 자동 강하(메모리 상한 대응).
 *  - [OPT-2] 골드/펄스 글로우를 오프스크린 스프라이트로 1회 렌더 → 프레임당 그라데이션 생성 0.
 *  - [OPT-3] 프레임 루프 무할당 — 배열 filter·문자열 조립 제거, swap-remove.
 *  - [OPT-7] 적응형 품질 강등 — 프레임타임 이동평균이 나쁘면 단방향으로 노드/펄스 감축.
 *  - [OPT-8] prefers-reduced-motion 변경 리스너 — 세션 중 토글 즉시 반영.
 *
 * 라이브러리 0(순수 canvas + rAF) — 랜딩 JS 예산 유지.
 */

export interface ParticleFieldProps {
  /** near-black 배경(Footer/Technology) 여부 — 노드/연결선 색을 밝게 전환. */
  dark?: boolean;
  /** 노드 개수(데스크톱 기준). 모바일은 자동으로 축소. 상한 하드코딩됨. */
  density?: number;
  /** 골드 신호 노드 비율(0~1). 나머지는 뉴트럴. 브랜드 규율상 소수만 골드. */
  signalRatio?: number;
  /** 유영 속도 배수(강조형=1.0, 절제형=0.6). */
  speed?: number;
  /** 포인터 반응 반경(px). 0이면 반응 비활성. */
  pointerRadius?: number;
  /** 노드 연결선 거리 임계값(px). 클수록 신경망이 촘촘해짐(연결 수는 거리² 비례). */
  linkDist?: number;
  className?: string;
  style?: CSSProperties;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  gold: boolean;
  /** 신호 위상(0~1) — 골드 노드의 맥동/펄스에 사용. */
  phase: number;
}

/** 시냅스 펄스 — 골드 노드에서 이웃 노드로 날아가는 밝은 신호 패킷.
 *  노드 "참조"를 들고 매 프레임 lerp → 움직이는 노드 사이를 정확히 추적. */
interface Pulse {
  a: Node;
  b: Node;
  /** 진행도 0→1 */
  t: number;
  /** 프레임당 진행 속도 */
  v: number;
}

// 하드 상한 — 어떤 density가 와도 이 이상은 안 만든다(모바일 발열/잔크 방지).
const MAX_NODES = 90;
const MOBILE_BP = 720;
// 동시 활성 시냅스 펄스 상한 — 난사 방지(정밀 시스템 톤 유지).
const MAX_PULSES = 8;
// [OPT-1] 백킹 스토어 픽셀 예산(≈2.5MP). 큰 섹션 캔버스의 effDpr을 자동 강하해
// iOS Safari 캔버스 메모리 상한/GPU 표면 비용을 억제. 파티클은 원·선이라 저해상 열화 미미.
const PIXEL_BUDGET = 2_500_000;
// effDpr 하한 — 예산이 아무리 빡빡해도 이 밑으로는 안 내려가(과도한 뭉개짐 방지).
const MIN_EFF_DPR = 0.75;
// 글로우 스프라이트 반경(px) — 노드 최대 반경 대비 넉넉히. 그릴 때 크기 스케일로 조정.
const GLOW_SPRITE_R = 24;
// [OPT-7] 적응형 강등 임계 — 이동평균 프레임타임(ms)이 이 값을 지속 초과하면 강등.
const DEGRADE_MS = 24;

export function ParticleField({
  dark = false,
  density = 44,
  signalRatio = 0.16,
  speed = 1,
  pointerRadius = 150,
  linkDist = 132,
  className,
  style,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let effDpr = 1;
    let nodes: Node[] = [];
    let golds: Node[] = []; // [OPT-3] 골드 노드 캐시(불변) — 프레임마다 filter 안 함
    let pulses: Pulse[] = [];
    let raf = 0;
    let running = false;
    // [OPT-7] 적응형 강등 상태(단방향).
    let linkDistEff = linkDist;
    let pulsesEnabled = true;
    let degradeLevel = 0;
    let ftAvg = 16.7; // 프레임타임 이동평균(ms)
    let lastTs = 0;
    // 포인터 위치(CSS px). 화면 밖 초기값으로 반응 없음 상태 시작.
    const pointer = { x: -9999, y: -9999, active: false };

    // 색 문자열(canvas는 CSS 변수 직접 못 씀 → 확정). [OPT-3] 프레임 내 조립 제거.
    const COL = {
      node: dark ? 'rgba(255,255,255,0.5)' : 'rgba(10,10,10,0.42)',
      link: dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,10,10,0.14)',
      gold: 'rgb(250,204,21)',
      goldLinkBase: dark ? 'rgba(250,204,21,' : 'rgba(250,204,21,',
      pulseCore: 'rgb(255,232,120)',
    } as const;

    // ── [OPT-2] 글로우 스프라이트 사전 렌더(오프스크린) ──
    // 골드 노드 후광 + 펄스 후광을 동일 그라데이션으로 1회만 그려두고, 프레임에선 drawImage.
    const glowSprite = document.createElement('canvas');
    const buildGlowSprite = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      const size = Math.ceil(GLOW_SPRITE_R * 2 * d);
      glowSprite.width = size;
      glowSprite.height = size;
      const gc = glowSprite.getContext('2d');
      if (!gc) return;
      gc.setTransform(d, 0, 0, d, 0, 0);
      const c = GLOW_SPRITE_R;
      const g = gc.createRadialGradient(c, c, 0, c, c, GLOW_SPRITE_R);
      g.addColorStop(0, 'rgba(250,204,21,1)');
      g.addColorStop(1, 'rgba(250,204,21,0)');
      gc.fillStyle = g;
      gc.beginPath();
      gc.arc(c, c, GLOW_SPRITE_R, 0, Math.PI * 2);
      gc.fill();
    };

    const nodeCount = () => {
      const isMobile = width < MOBILE_BP;
      const base = isMobile ? Math.round(density * 0.5) : density;
      const budgeted = Math.min(MAX_NODES, Math.max(8, base));
      // [OPT-7] 강등 1단계에서 노드 25% 감축.
      return degradeLevel >= 1 ? Math.max(8, Math.round(budgeted * 0.75)) : budgeted;
    };

    const seed = () => {
      const count = nodeCount();
      nodes = Array.from({ length: count }, (_, i) => {
        const gold = i / count < signalRatio;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28 * speed,
          vy: (Math.random() - 0.5) * 0.28 * speed,
          r: gold ? 2.2 + Math.random() * 1.2 : 1.1 + Math.random() * 1.1,
          gold,
          phase: Math.random(),
        };
      });
      golds = nodes.filter((n) => n.gold); // [OPT-3] 1회 산출
      pulses = []; // 노드 재생성 시 옛 참조 펄스 무효화
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      // [OPT-1] 픽셀 예산 기반 effDpr — 큰 캔버스는 자동 강하.
      const area = Math.max(1, width * height);
      const budgetDpr = Math.sqrt(PIXEL_BUDGET / area);
      effDpr = Math.max(MIN_EFF_DPR, Math.min(dpr, budgetDpr));
      canvas.width = Math.max(1, Math.round(width * effDpr));
      canvas.height = Math.max(1, Math.round(height * effDpr));
      ctx.setTransform(effDpr, 0, 0, effDpr, 0, 0);
      buildGlowSprite();
      seed();
    };

    let t = 0;
    const draw = (ts: number) => {
      raf = 0;
      t += 1;

      // [OPT-7] 프레임타임 이동평균 + 단방향 강등.
      if (lastTs) {
        const dt = ts - lastTs;
        ftAvg += (dt - ftAvg) * 0.1; // EMA
        if (ftAvg > DEGRADE_MS && t > 40) {
          if (degradeLevel === 0) {
            degradeLevel = 1;
            pulsesEnabled = false;
            seed(); // 노드 25% 감축 재시드
            ftAvg = 16.7;
          } else if (degradeLevel === 1 && t > 120) {
            degradeLevel = 2;
            linkDistEff = linkDist * 0.8; // 연결선 수 급감
            ftAvg = 16.7;
          }
        }
      }
      lastTs = ts;

      ctx.clearRect(0, 0, width, height);

      // 1) 노드 이동 + 포인터 인력.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        if (finePointer && pointer.active && pointerRadius > 0) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < pointerRadius && dist > 0.01) {
            const pull = (1 - dist / pointerRadius) * 1.0;
            n.x += (dx / dist) * pull;
            n.y += (dy / dist) * pull;
          }
        }
      }

      // 2) 연결선(O(n²), n≤90). 거리 비례 alpha. [OPT-3] 골드 링크 alpha는 globalAlpha로.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > linkDistEff) continue;
          const strength = 1 - dist / linkDistEff;
          if (a.gold || b.gold) {
            ctx.strokeStyle = COL.gold;
            ctx.globalAlpha = 0.32 * strength;
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = COL.link;
            ctx.globalAlpha = strength;
            ctx.lineWidth = 0.8;
          }
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // 3) 노드 점 + 골드 맥동 글로우([OPT-2] 스프라이트 blit).
      for (const n of nodes) {
        if (n.gold) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.045 + n.phase * Math.PI * 2);
          const glowA = 0.2 + 0.35 * pulse;
          const gr = n.r * 6; // 후광 반경(스프라이트를 이 크기로 스케일)
          ctx.globalAlpha = glowA;
          ctx.drawImage(glowSprite, n.x - gr, n.y - gr, gr * 2, gr * 2);
          ctx.globalAlpha = 0.7 + 0.3 * pulse;
          ctx.fillStyle = COL.gold;
        } else {
          ctx.globalAlpha = 1;
          ctx.fillStyle = COL.node;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 4) 시냅스 펄스 — 골드 노드에서 이웃으로 신호 패킷 발사([OPT-3] 무할당 + [OPT-2] 스프라이트).
      if (pulsesEnabled && pulses.length < MAX_PULSES && golds.length && Math.random() < 0.08) {
        const a = golds[(Math.random() * golds.length) | 0];
        let best: Node | null = null;
        let bd = Infinity;
        const reach = linkDistEff * 1.3;
        for (const n of nodes) {
          if (n === a) continue;
          const d = Math.hypot(n.x - a.x, n.y - a.y);
          if (d < reach && d < bd) {
            bd = d;
            best = n;
          }
        }
        if (best) pulses.push({ a, b: best, t: 0, v: 0.018 + Math.random() * 0.02 });
      }
      // 진행 + 그리기 + swap-remove(뒤에서 앞으로 순회, filter 배열 생성 없음).
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.v;
        if (p.t >= 1) {
          pulses[i] = pulses[pulses.length - 1];
          pulses.pop();
          continue;
        }
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const fade = Math.min(1, Math.min(p.t, 1 - p.t) * 6);
        ctx.globalAlpha = 0.85 * fade;
        ctx.drawImage(glowSprite, x - 10, y - 10, 20, 20);
        ctx.globalAlpha = 0.95 * fade;
        ctx.fillStyle = COL.pulseCore;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || rm.matches) return; // [OPT-8] RM면 시작 안 함
      running = true;
      lastTs = 0;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      ctx.clearRect(0, 0, width, height); // 정지 시 잔상 제거(RM 토글 대응)
    };

    // ── 가시성 게이트 ──
    let inView = false;
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                inView = e.isIntersecting;
                if (inView) start();
                else stop();
              }
            },
            { threshold: 0.01 },
          )
        : null;

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (io === null || inView) start();
    };

    // [OPT-8] reduced-motion 세션 중 토글 대응.
    const onRmChange = () => {
      if (rm.matches) stop();
      else if (inView && !document.hidden) start();
    };
    rm.addEventListener('change', onRmChange);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => resize())
        : null;

    resize();
    if (io) io.observe(canvas);
    else {
      inView = true;
      start();
    }
    if (ro) ro.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    const parent = canvas.parentElement ?? canvas;
    if (finePointer && pointerRadius > 0) {
      parent.addEventListener('pointermove', onPointerMove);
      parent.addEventListener('pointerleave', onPointerLeave);
    }
    window.addEventListener('resize', resize);

    return () => {
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      rm.removeEventListener('change', onRmChange);
      document.removeEventListener('visibilitychange', onVisibility);
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
    };
  }, [dark, density, signalRatio, speed, pointerRadius, linkDist]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.field}${className ? ` ${className}` : ''}`}
      style={style}
      aria-hidden="true"
    />
  );
}
