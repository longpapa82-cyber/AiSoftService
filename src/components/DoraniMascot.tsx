// 도란이 캐릭터 — 도란도란 홍보웹(promo-web/scripts/dorani.js)의 SVG를 React JSX로 이식.
// 앱 소스(app doraniParts.ts/doraniFace.ts)에서 1:1로 옮긴 좌표를 그대로 사용해
// 앱·홍보웹과 픽셀 단위로 동일한 도란이를 그린다.
//
// 미니 홍보 섹션은 정적 도란이(연령 peer × 성별 neutral × 표정 smile)만 필요하므로
// dorani.js의 해당 경로만 JSX로 변환했다(표정 전환·눈추적·성별 소품은 미이식 — YAGNI).
// ⚠️ dangerouslySetInnerHTML 미사용: 좌표를 <path>/<circle>/<ellipse> JSX로 직접 렌더 → XSS 표면 0.
//
// peer 그라디언트 색은 dorani.js의 lightenHex(#8FE3D8,0.22)=#a8e9e1, darkenHex(#8FE3D8,0.1)=#81ccc2를
// 빌드타임에 사전 계산해 상수로 박았다(런타임 색 계산 함수 불필요).

interface DoraniMascotProps {
  className?: string;
}

// AGES.peer + smile 표정 (dorani.js AGES.peer / faceMarkup('smile', peer) 좌표)
const INK = '#282E38';
const FILL = '#8FE3D8';
const FILL_LIGHT = '#a8e9e1'; // lightenHex(FILL, 0.22)
const FILL_DARK = '#81ccc2'; // darkenHex(FILL, 0.1)
const LINE = '#3FA6AE';
const BLUSH = '#F0A98C';

export function DoraniMascot({ className }: DoraniMascotProps) {
  return (
    <svg
      className={className}
      viewBox="0 -18 200 208"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="도란이 캐릭터"
    >
      <defs>
        {/* 몸통 젤리 그라디언트(위 밝음→아래 진함) */}
        <linearGradient id="dorani-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FILL_LIGHT} />
          <stop offset="0.55" stopColor={FILL} />
          <stop offset="1" stopColor={FILL_DARK} />
        </linearGradient>
        {/* 상단 광택 하이라이트 */}
        <radialGradient id="dorani-hl" cx="0.4" cy="0.28" r="0.5">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 그리는 순서: 안테나 → 몸통(밑동 덮음) → 하이라이트 → 얼굴 → 볼 */}
      <g>
        {/* 안테나 */}
        <path
          d="M64 30 Q58 12 70 8 M136 30 Q142 12 130 8"
          fill="none"
          stroke={LINE}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 몸통 */}
        <path
          d="M100 22 C148 22 176 58 176 104 C176 152 146 178 100 178 C54 178 24 152 24 104 C24 58 52 22 100 22 Z"
          fill="url(#dorani-body)"
          stroke={LINE}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 상단 광택 하이라이트 (cx=100-(126-74)*0.18=90.64, cy=eyeY-34=62) */}
        <ellipse cx="90.64" cy="62" rx="42" ry="26" fill="url(#dorani-hl)" />

        {/* 눈 (eyeXs=[74,126], eyeY=96, eyeR=7, hiR=2.4) */}
        <circle cx="74" cy="96" r="7" fill={INK} />
        <circle cx="76.5" cy="93.5" r="2.4" fill="#ffffff" />
        <circle cx="126" cy="96" r="7" fill={INK} />
        <circle cx="128.5" cy="93.5" r="2.4" fill="#ffffff" />

        {/* 입 (smile, mouthY=118, mouthDip=12) */}
        <path
          d="M88 118 Q100 130 112 118"
          fill="none"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 볼 blush (2개) */}
        <ellipse cx="58" cy="112" rx="11" ry="7" fill={BLUSH} opacity="0.62" />
        <ellipse cx="142" cy="112" rx="11" ry="7" fill={BLUSH} opacity="0.62" />
      </g>
    </svg>
  );
}
