/**
 * Material Symbols 아이콘 이름 → 이모지 매핑.
 * 외부 아이콘 폰트 추가 부담 없이 일관된 시각 표현을 제공한다.
 * 서비스 features의 icon 키(services.ts)를 이모지로 변환.
 */
const ICON_MAP: Record<string, string> = {
  auto_awesome: '✨',
  partly_cloudy_day: '🌤️',
  tune: '🎛️',
  pin_drop: '📍',
  health_and_safety: '🩺',
  favorite: '💗',
  newspaper: '🗞️',
  event: '🗓️',
  bookmark: '🔖',
};

export function iconFor(name: string): string {
  return ICON_MAP[name] ?? '◆';
}
