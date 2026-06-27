// AI Soft 서비스 카탈로그.
// 신규 서비스는 이 배열에 항목만 추가하면 쇼케이스/Features 등에 자동 반영된다.
// (CLAUDE.md: "신규 서비스가 추가될 수 있는 형태로 개발")

// 실제 앱 아이콘(각 서비스 빌드 자산에서 추출, 256px 최적화).
import mytravelIcon from '../assets/services/mytravel-icon.png';
import mypetIcon from '../assets/services/mypet-icon.png';
import mybabyIcon from '../assets/services/mybaby-icon.png';

export type ServiceStatus = 'live' | 'beta' | 'coming_soon';

export interface ServiceFeature {
  icon: string; // Material Symbols 아이콘 이름
  title: string;
  desc: string;
}

export interface ServiceTheme {
  /** 카드 본문 배경 */
  surface: string;
  /** 카드 위 본문 텍스트 */
  ink: string;
  /** 보조 텍스트 */
  inkSoft: string;
  /** 주 브랜드/CTA 컬러 */
  primary: string;
  /** 포인트/보조 컬러 */
  accent: string;
  /** 카드 배경 그라디언트(히어로 영역) */
  gradient: string;
  /** 카드 본문에 적용할 폰트 패밀리 */
  font: string;
  /** 카드 위에서 primary 버튼 텍스트 색 (대비 보장) */
  onPrimary: string;
}

/**
 * 미니 홍보 섹션 전용 확장 데이터.
 * 각 서비스의 "작은 홍보 사이트" — 해당 서비스의 실제 웹/앱 디자인을 그대로 재현하기 위한
 * 풀 테마(시그니처 컬러/폰트/라운드) + 진짜 카피 + 시그니처 비주얼.
 *
 * theme(통합 카드용, 톤다운)과 별개로, promo.palette는 각 서비스의 *진짜* 시그니처 색을 쓴다.
 * (예: myPet은 통합 카드에선 그린이지만, 미니 홍보에선 샴페인골드+코랄)
 */
export interface ServicePromo {
  /** 섹션 무드 한 줄 (eyebrow) */
  kicker: string;
  /** 미니 홍보 헤드라인 (실제 서비스 카피) */
  headline: string;
  /** 헤드라인에서 브랜드 강조될 부분(있으면 그라디언트/포인트 처리) */
  headlineAccent?: string;
  /** 서브 카피 (실제 서비스 설명 문구) */
  subcopy: string;
  /** 미니 홍보 풀 테마 팔레트 (각 서비스 시그니처 색) */
  palette: {
    /** 섹션 배경 (페이지 베이스) */
    bg: string;
    /** 히어로/카드 배경 그라디언트 */
    heroGradient: string;
    /** 표면(카드) 배경 */
    surface: string;
    /** 주 브랜드 컬러 */
    primary: string;
    /** 포인트/액센트 컬러 */
    accent: string;
    /** 헤딩 잉크 */
    ink: string;
    /** 본문 잉크 */
    inkSoft: string;
    /** primary 위 텍스트 색 */
    onPrimary: string;
  };
  /** 디스플레이/본문 폰트 패밀리 (실제 서비스 폰트) */
  fontDisplay: string;
  fontBody: string;
  /** 카드/표면 라운드 (px). myPet=28 claymorphism 등 */
  radius: number;
  /** 시그니처 장식 패턴: 발자국/별/도트 등 */
  motif: 'paw' | 'sky' | 'feed' | 'none';
  /** 미니 홍보용 통계 칩 (실제 수치) */
  highlights: { value: string; label: string }[];
}

export interface AppService {
  id: string;
  name: string;
  /** 한 줄 캐치프레이즈 */
  tagline: string;
  /** 카드 본문 설명 */
  description: string;
  status: ServiceStatus;
  /** 무드 라벨 (카드 상단 칩) */
  moodLabel: string;
  /** 폴백/장식용 이모지 */
  emoji: string;
  /** 실제 앱 아이콘 URL (Vite가 최적화한 경로) */
  iconUrl: string;
  links: {
    web?: string;
    ios?: string;
    android?: string;
  };
  theme: ServiceTheme;
  features: ServiceFeature[];
  stats?: { label: string; value: string }[];
  /** 미니 홍보 섹션 데이터 (선택 — 없으면 미니 섹션 미생성) */
  promo?: ServicePromo;
  order: number;
}

export const SERVICES: AppService[] = [
  {
    id: 'mytravel',
    name: 'myTravel',
    tagline: 'AI가 만드는 맞춤형 여행',
    description:
      '복잡한 여행 계획은 AI에게 맡기세요. 목적지만 정하면 일정·날씨·동선까지 3단계로 완성됩니다. 17개 언어를 지원합니다.',
    status: 'live',
    moodLabel: 'Dark Tech Luxe',
    emoji: '✦',
    iconUrl: mytravelIcon,
    links: {
      web: 'https://www.myTravel-planner.com',
      ios: 'https://apps.apple.com/app/id6766147060',
      android:
        'https://play.google.com/store/apps/details?id=com.longpapa82.travelplanner',
    },
    theme: {
      surface: '#ffffff',
      ink: '#14304f',
      inkSoft: '#5a6a86',
      primary: '#3a86d4',
      accent: '#2dd4bf',
      gradient:
        'linear-gradient(135deg, #d6ecff 0%, #eaf6ff 55%, #e0fbf4 100%)',
      font: "'Noto Sans KR', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'auto_awesome', title: 'AI 자동 일정', desc: '목적지 선택만으로 맞춤 일정 생성' },
      { icon: 'partly_cloudy_day', title: '실시간 날씨·시차', desc: '여행지 날씨와 시차 정보 제공' },
      { icon: 'tune', title: '자유로운 편집', desc: '일정 추가·삭제·순서 변경 자유' },
    ],
    stats: [{ label: '지원 언어', value: '17개' }],
    promo: {
      kicker: 'AI Travel Planner',
      headline: '목적지만 정하면,\n나머지는 ',
      headlineAccent: 'AI가',
      subcopy:
        '복잡한 여행 계획은 AI에게 맡기세요. 일정·날씨·동선까지 3단계로 완성. 17개 언어로 전 세계 어디든 떠날 수 있습니다.',
      // travelPlanner Design System v2.0: 오션블루 #3B82F6 + 석양오렌지 #F59E0B
      palette: {
        bg: '#f6fbff',
        heroGradient:
          'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 52%, #F59E0B 120%)',
        surface: '#ffffff',
        primary: '#2563EB',
        accent: '#F59E0B',
        ink: '#0f2742',
        inkSoft: '#51627a',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Noto Sans KR', system-ui, sans-serif",
      fontBody: "'Noto Sans KR', system-ui, sans-serif",
      radius: 20,
      motif: 'sky',
      highlights: [
        { value: '17개', label: '지원 언어' },
        { value: '3단계', label: '일정 완성' },
        { value: 'AI', label: '자동 추천' },
      ],
    },
    order: 1,
  },
  {
    id: 'mypet',
    name: 'myPet',
    tagline: '반려동물의 모든 순간을 함께',
    description:
      '주변 펫 시설 검색부터 AI 건강 상담까지. 반려동물과의 일상을 따뜻하고 똑똑하게 케어하세요.',
    status: 'live',
    moodLabel: 'Warm Light Luxury',
    emoji: '🐾',
    iconUrl: mypetIcon,
    links: {
      ios: 'https://apps.apple.com/kr/app/id6780117383',
      android: 'https://play.google.com/store/apps/details?id=com.longpapa82.mypet',
    },
    theme: {
      surface: '#fcfdfc',
      ink: '#2e5d4b',
      inkSoft: '#5a6b62',
      primary: '#2f7d5e',
      accent: '#ff6b5c',
      gradient: 'linear-gradient(135deg, #dcead9 0%, #f3f4f2 100%)',
      font: "'Quicksand', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'pin_drop', title: '주변 펫 시설', desc: '동물병원·미용·카페 위치 검색' },
      { icon: 'health_and_safety', title: 'AI 건강 상담', desc: '증상 기반 AI 건강 가이드' },
      { icon: 'favorite', title: '케어 기록', desc: '반려동물 일상과 건강 관리' },
    ],
    promo: {
      kicker: '반려동물 필수 정보 앱',
      headline: '반려생활 필수 정보를\n한 곳에서, ',
      headlineAccent: 'MyPet',
      subcopy:
        '내 주변 펫 시설을 거리순으로 찾고, AI에게 반려동물 건강·법률을 바로 물어보세요. 등록된 3만여 곳의 병원·미용실·호텔·용품점까지 한 번에.',
      // myPet web: 샴페인골드 #c19a5b + 코랄 #ff6b5c + 크림 아이보리, claymorphism
      palette: {
        bg: '#f3f4f2',
        heroGradient:
          'linear-gradient(160deg, #fff1ea 0%, #fef7f3 50%, #f7fafe 100%)',
        surface: '#fcfdfc',
        primary: '#c19a5b',
        accent: '#ff6b5c',
        ink: '#232629',
        inkSoft: '#51555a',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Jua', 'Quicksand', system-ui, sans-serif",
      fontBody: "'Quicksand', system-ui, sans-serif",
      radius: 28,
      motif: 'paw',
      highlights: [
        { value: '3만+', label: '등록 시설' },
        { value: '거리순', label: '시설 검색' },
        { value: 'AI', label: '건강 상담' },
      ],
    },
    order: 2,
  },
  {
    id: 'mybaby',
    name: '내새끼',
    tagline: '최애의 모든 소식을 한곳에',
    description:
      '좋아하는 셀럽의 뉴스와 일정을 놓치지 마세요. 깔끔한 피드로 최애의 모든 순간을 빠르게 확인합니다.',
    status: 'live',
    moodLabel: 'Cool Clean',
    emoji: '💙',
    iconUrl: mybabyIcon,
    links: {
      ios: 'https://apps.apple.com/app/id6772832100',
      android: 'https://play.google.com/store/apps/details?id=com.naesaekki.app',
    },
    theme: {
      surface: '#ffffff',
      ink: '#111827',
      inkSoft: '#6b7280',
      primary: '#2196f3',
      accent: '#00bfa5',
      gradient: 'linear-gradient(135deg, #e3f2fd 0%, #f4f6f8 100%)',
      font: "'Plus Jakarta Sans', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'newspaper', title: '최신 뉴스피드', desc: '최애의 소식을 실시간 카드 피드로' },
      { icon: 'event', title: '일정 알림', desc: '컴백·방송·이벤트 일정 관리' },
      { icon: 'bookmark', title: '스크랩', desc: '중요한 소식 저장하고 다시 보기' },
    ],
    promo: {
      kicker: '최애 소식 모아보기',
      headline: '내가 애정하는\n스타의 모든 ',
      headlineAccent: '소식',
      subcopy:
        '좋아하는 셀럽의 뉴스와 일정을 놓치지 마세요. AI가 모아주는 깔끔한 카드 피드로 최애의 모든 순간을 빠르게 확인합니다.',
      // myBaby app: 스카이블루 #2196F3 + 민트 #00BFA5, White-First
      palette: {
        bg: '#f4f6f8',
        heroGradient:
          'linear-gradient(150deg, #e3f2fd 0%, #f4f6f8 55%, #e0f2f1 100%)',
        surface: '#ffffff',
        primary: '#2196f3',
        accent: '#00bfa5',
        ink: '#111827',
        inkSoft: '#6b7280',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Jua', 'Plus Jakarta Sans', system-ui, sans-serif",
      fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
      radius: 28,
      motif: 'feed',
      highlights: [
        { value: 'AI', label: '소식 수집' },
        { value: '실시간', label: '뉴스 피드' },
        { value: '알림', label: '일정 관리' },
      ],
    },
    order: 3,
  },
];

export const SERVICES_SORTED = [...SERVICES].sort((a, b) => a.order - b.order);
