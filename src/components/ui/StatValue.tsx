import { useCountUp } from '../../hooks/useCountUp';

/**
 * 수치 문자열("17개"·"30초"·"4.9"·"1,000원")의 숫자부만 뷰포트 진입 시
 * 0→목표로 카운트업하고, 접두/접미("개"·"초" 등)는 그대로 유지하는 수치 표시.
 * 순수 비수치("실시간"·"무료")는 카운트업 없이 정적 렌더 폴백.
 *
 * reduce-motion / IO 미지원 → 즉시 최종값(useCountUp 내장 가드).
 * 소수("4.9")는 자릿수를 보존해 스케일링 카운트, 콤마("1,000")는 로케일 포맷 유지.
 */
interface StatValueProps {
  value: string;
  className?: string;
  /** 카운트 길이(ms). 기본 1100 */
  durationMs?: number;
  /** 시작 지연(ms) */
  delayMs?: number;
}

const NUM_RE = /(\d[\d,]*(?:\.\d+)?)/;

export function StatValue({
  value,
  className,
  durationMs = 1100,
  delayMs = 0,
}: StatValueProps) {
  const match = value.match(NUM_RE);
  const numStr = match?.[1] ?? '';
  const hasComma = numStr.includes(',');
  const decimals = numStr.split('.')[1]?.length ?? 0;
  const scale = 10 ** decimals;
  const target = match ? parseFloat(numStr.replace(/,/g, '')) : 0;

  // 훅 규칙상 무조건 호출 — 비수치면 target 0으로 돌고 아래에서 정적 폴백 렌더.
  const [ref, raw] = useCountUp<HTMLSpanElement>(Math.round(target * scale), {
    durationMs,
    delayMs,
  });

  if (!match || match.index === undefined) {
    return <span className={className}>{value}</span>;
  }

  const prefix = value.slice(0, match.index);
  const suffix = value.slice(match.index + numStr.length);
  const display =
    decimals > 0
      ? (raw / scale).toFixed(decimals)
      : hasComma
        ? raw.toLocaleString('ko-KR')
        : String(raw);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
