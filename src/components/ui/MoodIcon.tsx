/**
 * MoodIcon.tsx — myToday 기분 5단계 "새싹 얼굴" 아이콘 (웹 포팅).
 *
 * 실제 myToday 앱의 BrandMoodIcon(react-native-svg)을 웹 표준 <svg>로 포팅.
 * 시스템 이모지(😔🙂🤩…) 대신 앱 자체 브랜드 아이콘으로 통일해
 * 랜딩과 실제 앱의 시각 언어를 일치시킨다. viewBox(0 0 24 24)·path 좌표 동일.
 *
 *   1 우울 : 처진 눈 + 처진 입
 *   2 지침 : 반쯤 감은 눈 + 평평한 입
 *   3 평온 : 점 눈 + 옅은 미소
 *   4 행복 : 점 눈 + 볼터치 + 미소
 *   5 신남 : 반짝 눈 + 활짝 웃음(채운 입)
 */

export type MoodScore = 1 | 2 | 3 | 4 | 5;

interface MoodIconProps {
  /** 기분 점수(1=우울 ~ 5=신남). */
  score: MoodScore;
  /** 크기(px). 기본 26. */
  size?: number;
  /** 얼굴 선/채움 색. 기본 딥 잉크(칩 배경 위 가독성). */
  color?: string;
}

const STROKE_WIDTH = 1.8;
/** 신남(5) 반짝 눈 하이라이트용 밝은 톤. */
const SPARKLE = 'rgba(255, 255, 255, 0.92)';

export function MoodIcon({ score, size = 26, color = '#3d4a2f' }: MoodIconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: STROKE_WIDTH,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      {/* 머리 떡잎 2장(공통) — 새싹 정체성 */}
      <path d="M12 5.6 Q10.3 3.5 8.4 4.4 Q9 6.6 12 6.3" {...stroke} />
      <path d="M12 5.6 Q13.7 3.5 15.6 4.4 Q15 6.6 12 6.3" {...stroke} />
      {/* 얼굴 원(공통) */}
      <circle cx={12} cy={13} r={6.6} {...stroke} />
      <Face score={score} color={color} stroke={stroke} />
    </svg>
  );
}

type StrokeProps = {
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'round';
  strokeLinejoin: 'round';
  fill: 'none';
};

function Face({
  score,
  color,
  stroke,
}: {
  score: MoodScore;
  color: string;
  stroke: StrokeProps;
}) {
  const dot = (cx: number, cy: number, r = 1) => (
    <circle cx={cx} cy={cy} r={r} fill={color} />
  );

  switch (score) {
    case 1: // 우울
      return (
        <>
          <path d="M8.6 11.4 Q9.6 12 10.6 11.4" {...stroke} />
          <path d="M13.4 11.4 Q14.4 12 15.4 11.4" {...stroke} />
          <path d="M9.6 15.6 Q12 14 14.4 15.6" {...stroke} />
        </>
      );
    case 2: // 지침
      return (
        <>
          <path d="M8.8 11.6 H10.6" {...stroke} />
          <path d="M13.4 11.6 H15.2" {...stroke} />
          <path d="M9.8 15 H14.2" {...stroke} />
        </>
      );
    case 3: // 평온
      return (
        <>
          {dot(9.7, 11.6)}
          {dot(14.3, 11.6)}
          <path d="M9.8 14.6 Q12 15.8 14.2 14.6" {...stroke} />
        </>
      );
    case 4: // 행복
      return (
        <>
          {dot(9.7, 11.6)}
          {dot(14.3, 11.6)}
          <circle cx={8.2} cy={13.6} r={1} fill={color} opacity={0.35} />
          <circle cx={15.8} cy={13.6} r={1} fill={color} opacity={0.35} />
          <path d="M9.4 14.4 Q12 16.4 14.6 14.4" {...stroke} />
        </>
      );
    case 5: // 신남
    default:
      return (
        <>
          {dot(9.7, 11.4, 1.2)}
          {dot(14.3, 11.4, 1.2)}
          <circle cx={9.3} cy={11} r={0.4} fill={SPARKLE} />
          <circle cx={13.9} cy={11} r={0.4} fill={SPARKLE} />
          {/* 활짝 웃음(채운 반원 입) */}
          <path
            d="M9 14 Q12 17.6 15 14 Z"
            fill={color}
            stroke={stroke.stroke}
            strokeWidth={stroke.strokeWidth}
            strokeLinecap={stroke.strokeLinecap}
            strokeLinejoin={stroke.strokeLinejoin}
          />
        </>
      );
  }
}
