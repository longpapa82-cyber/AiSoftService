// 에이아이소프트 서비스 카탈로그.
// 신규 서비스는 이 배열에 항목만 추가하면 쇼케이스/Features 등에 자동 반영된다.
// (CLAUDE.md: "신규 서비스가 추가될 수 있는 형태로 개발")

// 실제 앱 아이콘(각 서비스 빌드 자산에서 추출, 256px 최적화).
import mytravelIcon from '../assets/services/mytravel-icon.png';
import mypetIcon from '../assets/services/mypet-icon.png';
import mybabyIcon from '../assets/services/mybaby-icon.png';
import mytodayIcon from '../assets/services/mytoday-icon.png';
import aimusicIcon from '../assets/services/aimusic-icon.png';
import lawpicIcon from '../assets/services/lawpic-icon.png';

// 각 서비스 홈페이지의 실제 실사 이미지(원본 프로젝트에서 추출).
// myPet: 실사 히어로(강아지) + 실제 앱 홈 스크린샷.
// myTravel: 실사를 원격 Unsplash URL로 로드 — 원본 앱과 동일 여행지 사진.
// myBaby: 실제 랜딩 히어로(K-pop 스타 4인 실사, hero-kpop4) 배경 — 다크 스크림으로 가독성 확보.
import mypetHero from '../assets/promo/mypet/hero-puppy.webp';
import mypetShot from '../assets/promo/mypet/shot-home.webp';
import mybabyHero from '../assets/promo/mybaby/hero-stars.webp';
// myToday: 새싹 마스코트(투명 배경) — 우측 히어로 일러스트.
import mytodayMascot from '../assets/promo/mytoday/mascot.webp';
// AI Music Studio: welcome 히어로 배경 + 실제 앱 홈(3단계) 스크린샷.
import aimusicShot from '../assets/promo/aimusic/shot-home.webp';
import aimusicHero from '../assets/promo/aimusic/hero-welcome.webp';
// 로픽: 부엉이 마스코트(투명 배경) — 우측 히어로 일러스트(myToday 새싹과 동일 취급).
import lawpicMascot from '../assets/promo/lawpic/mascot.webp';

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
  /**
   * 법적/사실 고지 문구(선택). AI 상담의 비진단성, 공개정보 기반 등
   * 오인 방지용 중요정보를 주장 카피와 같은 화면에 근접 배치한다.
   * (표시광고법: 중요정보 동일 화면·근접 표시 원칙)
   */
  disclaimer?: string;
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
  /** 시그니처 장식 패턴: 발자국/별/도트/잎사귀 등 */
  motif: 'paw' | 'sky' | 'feed' | 'leaf' | 'none';
  /** 미니 홍보용 통계 칩 (실제 수치) */
  highlights: { value: string; label: string }[];
  /**
   * 섹션 배경에 깔리는 실사 이미지 (각 서비스 홈의 실제 사진).
   * 로컬 import URL 또는 원격 URL(myTravel=Unsplash). 그라디언트 오버레이로 가독성 확보.
   */
  heroImage?: string;
  /** heroImage의 object-position (얼굴/피사체가 잘리지 않도록) */
  heroFocus?: string;
  /**
   * 우측 비주얼에 표시할 실제 앱 화면 스크린샷 (폰 목업).
   * 있으면 폰 프레임으로, 없으면 아이콘 카드로 표현.
   */
  shot?: string;
  /**
   * 우측 비주얼을 실사 갤러리로 구성할 때의 이미지+라벨 목록.
   * (myTravel: 실제 여행지 사진 — 원본 앱 Featured Destinations와 동일 Unsplash ID)
   */
  gallery?: { src: string; label: string; sub?: string }[];
  /**
   * 어두운 럭셔리 테마 여부. true면 다크 네이비 배경 + 골드/라이트 텍스트로 전환.
   * (내새끼 랜딩의 골드 넘버링 섹션 톤)
   */
  dark?: boolean;
  /**
   * 우측 비주얼: 번호 매긴 스텝 카드 (실제 랜딩의 "3단계" 흐름).
   * (myTravel: 1 목적지 선택 → 2 AI 일정 생성 → 3 …)
   */
  steps?: { no: string; title: string; desc: string }[];
  /**
   * 우측 비주얼: 스타/카테고리 그리드 칩 (내새끼 라인업 그리드).
   * 인물 실사 대신 원형 컬러 아바타 + 이름으로 표현(초상권 안전).
   */
  stars?: { name: string; tag: string; color: string }[];
  /**
   * 히어로 마스코트 캐릭터 이미지(투명 배경 PNG/WebP).
   * 있으면 상단/배경에 원형 프레임으로 큰 일러스트 배치(myToday 새싹).
   */
  mascot?: string;
  /**
   * 기분/감정 단계 칩 (myToday: 5단계 기분).
   * 각 단계의 앱 브랜드 아이콘(score) + 라벨 + 컬러로 원형 칩 표현.
   */
  moods?: { score: 1 | 2 | 3 | 4 | 5; label: string; color: string }[];
  /**
   * 로픽 전용: 조항 분석 결과 글래스 카드 목업(홍보 사이트의 시그니처 비주얼).
   * 문서 라벨 + 안심도 점수 + 주의(노랑)/안전(초록) 조항 리스트로,
   * "사진 → AI가 위험/안전 조항 구분" 서사를 우측 비주얼로 재현한다.
   * 있으면 shot/mascot/steps보다 우선해 렌더된다.
   */
  analysisCard?: {
    /** 분석 대상 문서 라벨 (예: "근로계약서.pdf · 조항 12개 검토 완료") */
    docLabel: string;
    /** 안심도 점수 (0~100). 링/바 게이지로 표시 */
    safetyScore: number;
    /**
     * 위험/안전 조항 집계 — 카드 우상단 "위험 N · 안전 M" 요약 pill.
     * 홍보 사이트 시그니처: 스캔 결과를 한눈에 정량화한다. clauses는 대표 예시만 보여주므로
     * 실제 검토 총계(riskCount/safeCount)를 별도로 표기한다.
     */
    tally?: { risk: number; safe: number };
    /**
     * 조항 리스트 — kind로 노랑(주의)/초록(안전) 좌측 컬러바 구분.
     * emphasis: text 안에서 강조할 핵심 문구(예: "24개월") — 볼드+컬러 하이라이트.
     * ownerNote: 부엉이가 풀어주는 "쉽게 말하면…" 설명 버블(주의 조항의 쉬운 해설).
     */
    clauses: {
      kind: 'caution' | 'safe';
      tag: string;
      text: string;
      emphasis?: string;
      ownerNote?: string;
    }[];
  };
  /** 멀티 액센트 — 안전(초록) 조항용. analysisCard와 함께 사용(로픽). */
  accentSafe?: string;
  /** 멀티 액센트 — 주의(노랑) 조항용. analysisCard와 함께 사용(로픽). */
  accentCaution?: string;
  /** 무료체험 강조 배지(로픽: "3일 무료체험"). 있으면 히어로 kicker 옆 pill로 표기. */
  trialBadge?: string;
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
    /**
     * Android 앱이 아직 스토어 미출시(준비 중)인 경우 true.
     * android 링크가 없어도 Google Play를 "준비 중" 비활성 배지로 표기해 기대감을 유발한다.
     * (iOS는 출시됐지만 Android는 준비 중인 혼합 상태 — 예: myToday)
     * status='coming_soon'(전체 미출시)과 달리 서비스별 스토어 단위로 동작한다.
     */
    androidPending?: boolean;
    /**
     * web이 홍보 랜딩이 아니라 법적 고지(개인정보/약관) 페이지인 경우 true.
     * true면 스토어 배지에서 App Store(또는 Play)를 주 CTA로 승격한다(설치 우선).
     */
    webIsLegal?: boolean;
  };
  theme: ServiceTheme;
  features: ServiceFeature[];
  stats?: { label: string; value: string }[];
  /** 미니 홍보 섹션 데이터 (선택 — 없으면 미니 섹션 미생성) */
  promo?: ServicePromo;
  order: number;
}

// ⚠️ 드리프트 주의: 각 서비스의 name/tagline/description은 index.html의 noscript 블록에
// 수동 복제되어 있다(SEO 폴백). 이 값을 수정하면 index.html noscript도 함께 갱신할 것.
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
      web: 'https://www.mytravel-planner.com',
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
      headline: 'AI가 만드는\n',
      headlineAccent: '나만의 여행 일정',
      subcopy:
        '목적지와 날짜만 입력하세요. AI가 명소·맛집·날씨·이동 동선까지 꼼꼼하게 계획합니다.',
      // 내새끼와 대비되는 딥 네이비 테크 럭셔리 (실제 랜딩 톤). 시안→블루 그라디언트 헤드라인.
      dark: true,
      palette: {
        bg: '#0c1828',
        heroGradient:
          'linear-gradient(135deg, #38bdf8 0%, #3b82f6 55%, #1e3a8a 100%)',
        surface: '#13243a',
        primary: '#5ab9f2',
        accent: '#38bdf8',
        ink: '#eef6ff',
        inkSoft: '#9fb4cc',
        onPrimary: '#062033',
      },
      fontDisplay: "'Noto Sans KR', system-ui, sans-serif",
      fontBody: "'Noto Sans KR', system-ui, sans-serif",
      radius: 20,
      motif: 'none',
      highlights: [
        { value: '17개', label: '지원 언어' },
        { value: 'AI 기반', label: '자동 일정' },
        { value: '20+', label: '인기 여행지' },
      ],
      // 실제 랜딩의 여행 소품 평면러이 실사 (지도+카메라+여권 flat-lay)
      heroImage:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=70&fm=webp&fit=crop',
      heroFocus: 'center 40%',
      // 우측 비주얼: 실제 랜딩의 "3단계로 완성하는 여행 계획" 번호 스텝
      steps: [
        {
          no: '1',
          title: '목적지 선택',
          desc: '가고 싶은 도시나 나라를 입력하세요. 인기 여행지를 빠르게 선택하거나 직접 검색할 수 있습니다.',
        },
        {
          no: '2',
          title: 'AI 일정 생성',
          desc: 'AI가 최근 여행 데이터와 현지 정보를 분석해 최적의 일정을 만들어 줍니다.',
        },
        {
          no: '3',
          title: '자유로운 편집',
          desc: '관광지·맛집·카페·쇼핑 등 시간대별 일정을 자유롭게 추가·삭제·재배치하세요.',
        },
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
      web: 'https://with-my-pet.com/',
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
        '내 주변 펫 시설을 거리순으로 찾고, AI에게 반려동물 건강·법률을 바로 물어보세요. 병원·미용실·호텔·용품점까지 한 곳에서.',
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
      // myPet web 홈의 실사 강아지 히어로 + 실제 앱 홈 화면 스크린샷
      heroImage: mypetHero,
      heroFocus: 'center 35%',
      shot: mypetShot,
      disclaimer:
        'AI 건강·법률 상담은 일반 정보 제공과 참고용이며, 수의학적 진단이나 법률 자문을 대체하지 않습니다. 시설 정보는 변동될 수 있습니다.',
    },
    order: 3,
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
      web: 'https://mybaby-backend.onrender.com/',
      ios: 'https://apps.apple.com/kr/app/id6772832100',
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
      kicker: 'AI 셀럽 뉴스 플랫폼',
      headline: '내가 애정하는\n스타의 모든 ',
      headlineAccent: '소식',
      subcopy:
        'K-pop·할리우드·라틴·유럽·스포츠까지, 전 세계 셀럽의 공개 소식을 AI가 핵심만 골라 요약해 드립니다.',
      // 내새끼 랜딩: 다크 네이비 럭셔리 + 골드 넘버링 (실제 랜딩 톤)
      dark: true,
      palette: {
        bg: '#0e1018',
        heroGradient:
          'linear-gradient(150deg, #1a1f33 0%, #12141f 55%, #0e1018 100%)',
        surface: '#191d2b',
        primary: '#f5c451',
        accent: '#ff8fb1',
        ink: '#f5f6fa',
        inkSoft: '#a3a8b8',
        onPrimary: '#1a1206',
      },
      fontDisplay: "'Jua', 'Plus Jakarta Sans', system-ui, sans-serif",
      fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
      radius: 22,
      motif: 'none',
      // 실제 랜딩 상단 히어로(K-pop 스타 4인 실사) — 다크 스크림 위에 골드 카피가 얹힌다.
      heroImage: mybabyHero,
      heroFocus: 'center 22%',
      highlights: [
        { value: '10,000+', label: '지원 셀럽' },
        { value: '37개국', label: '글로벌 라인업' },
        { value: '매일', label: 'AI 요약' },
      ],
      // 우측: 스타 라인업 그리드 (인물 실사 대신 원형 컬러 아바타 — 초상권 안전)
      stars: [
        { name: 'BTS', tag: 'K-pop', color: '#7c5cff' },
        { name: '아이유', tag: 'K-pop', color: '#ff7eb6' },
        { name: 'BLACKPINK', tag: 'K-pop', color: '#ff4f8b' },
        { name: 'SEVENTEEN', tag: 'K-pop', color: '#5ea0ff' },
        { name: 'NewJeans', tag: 'K-pop', color: '#9b8cff' },
        { name: 'aespa', tag: 'K-pop', color: '#4dd6c4' },
        { name: 'TWICE', tag: 'K-pop', color: '#ff9e57' },
        { name: '손흥민', tag: '스포츠', color: '#54c98a' },
      ],
      disclaimer:
        '공개된 뉴스·언론 기사를 AI가 정리해 보여주는 서비스로, 소속사·아티스트의 공식 정보가 아닙니다. 본 서비스는 표시된 아티스트·소속사와 제휴하거나 후원받지 않으며, 표시된 이름·소속은 각 권리자에게 귀속됩니다.',
    },
    order: 2,
  },
  {
    id: 'mytoday',
    name: 'myToday',
    tagline: '오늘도 새싹처럼 한 뼘씩',
    description:
      '매일의 기분을 기록하고 하고 싶은 일을 새싹처럼 키워보세요. 작은 습관이 모여 한 뼘씩 자라나는 나를 만나는 마음 습관 다이어리.',
    status: 'live',
    moodLabel: 'Fresh Sprout',
    emoji: '🌱',
    iconUrl: mytodayIcon,
    // iOS(Apple ID 6785864596)·Android(com.joyfulday.mytoday) 모두 출시 완료.
    // 주 CTA(포인트 컬러/골드) = 웹사이트(my-today.net 홍보 랜딩). webIsLegal 미설정 →
    // 기본 우선순위(웹사이트 > App Store > Google Play)로 웹사이트가 골드 강조.
    links: {
      ios: 'https://apps.apple.com/kr/app/id6785864596',
      android: 'https://play.google.com/store/apps/details?id=com.joyfulday.mytoday',
      web: 'https://my-today.net/',
    },
    theme: {
      surface: '#fcfdf8',
      ink: '#1a1c15',
      inkSoft: '#5b6350',
      primary: '#37811c',
      accent: '#f5a623',
      gradient: 'linear-gradient(135deg, #e8f6d4 0%, #f4faec 55%, #fef3dd 100%)',
      font: "'Gowun Dodum', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'mood', title: '오늘의 기분 체크', desc: '5단계 기분으로 하루 감정을 간단히 기록' },
      { icon: 'eco', title: '오늘의 할 일', desc: '할 일을 완료하면 나의 새싹이 한 뼘씩 성장' },
      { icon: 'local_florist', title: '성장하는 정원', desc: '스트릭·레벨로 꾸준함이 눈에 보이는 성장' },
    ],
    stats: [{ label: '기분 단계', value: '5단계' }],
    promo: {
      kicker: '마음 습관 다이어리',
      headline: '오늘도 새싹처럼\n한 뼘씩 ',
      headlineAccent: '자라나요',
      // description(카드·noscript용 정의형)과 구분되는 히어로 행동유도형 카피(중복 방지).
      subcopy:
        '오늘의 기분을 5단계로 남기고, 하고 싶은 일을 완료할수록 나의 새싹이 한 뼘씩 자라요. 작은 습관이 쌓이는 과정을 눈으로 확인해 보세요.',
      // myToday web: 연두→살구 그라디언트, 잎 그린 #37811c + 햇살 노랑 #f5a623, 몽글 자연톤
      palette: {
        bg: '#f4faec',
        heroGradient:
          'linear-gradient(150deg, #d6efb4 0%, #eef8dd 50%, #ffe9c4 100%)',
        surface: '#fcfdf8',
        primary: '#37811c',
        accent: '#f5a623',
        ink: '#1a1c15',
        inkSoft: '#5b6350',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Jua', system-ui, sans-serif",
      fontBody: "'Gowun Dodum', system-ui, sans-serif",
      radius: 24,
      motif: 'leaf',
      // 실제 랜딩 히어로의 새싹 마스코트 — 우측 비주얼 상단 원형 프레임.
      mascot: mytodayMascot,
      // 실제 앱 기분 5단계(우울·지침·평온·행복·신남) — 앱 자체 새싹 얼굴 아이콘(MoodIcon).
      moods: [
        { score: 1, label: '우울', color: '#f6c9a8' },
        { score: 2, label: '지침', color: '#f7d9a0' },
        { score: 3, label: '평온', color: '#cfe8a8' },
        { score: 4, label: '행복', color: '#a8dd8a' },
        { score: 5, label: '신남', color: '#8fd06a' },
      ],
      highlights: [
        { value: '5단계', label: '기분 기록' },
        { value: '9가지', label: '할 일 카테고리' },
        { value: '7종', label: '식물 도감' },
      ],
      // 우측 비주얼: 실제 랜딩 "이렇게 시작해요" 3단계 (가입 → 기록 → 성장)
      steps: [
        {
          no: '1',
          title: '가입하기',
          desc: '이메일 또는 구글·카카오·애플 계정으로 간편하게 시작해요.',
        },
        {
          no: '2',
          title: '기분·할 일 기록',
          desc: '오늘의 기분을 5단계로 체크하고, 하고 싶은 일을 등록해요.',
        },
        {
          no: '3',
          title: '새싹처럼 성장',
          desc: '할 일을 완료할수록 나의 새싹이 자라고 정원이 채워져요.',
        },
      ],
      disclaimer:
        '기분·감정 기록은 자기 관리와 습관 형성을 돕기 위한 것으로, 의학적·심리 상담을 대체하지 않습니다.',
    },
    order: 4,
  },
  {
    id: 'aimusic',
    name: 'AI Music Studio',
    tagline: '누구나 만드는 나만의 음악',
    description:
      '원하는 곡 내용을 입력하면 AI가 자동으로 음악을 만들어 주는 앱. 가수 보이스 유형을 골라 나만의 곡을 완성하고, 소장하거나 공유할 수 있어요. 트로트·팝·발라드부터 K-Pop·시티팝·재즈까지 8가지 장르, 30·60·180초 길이를 지원합니다.',
    // iOS 출시 완료(Apple ID 6789540285). Android는 준비 중(스토어 미출시) → androidPending으로 "준비 중" 배지 표기.
    // Android 출시 시 androidPending 제거하고 android 링크만 추가하면 자동 반영.
    // web은 웨이팅 홍보 랜딩이지만 iOS 출시로 앱 설치 유도가 우선이라 App Store를 primary로(webIsLegal).
    status: 'live',
    moodLabel: 'Dark Luxury Studio',
    emoji: '🎵',
    iconUrl: aimusicIcon,
    links: {
      ios: 'https://apps.apple.com/kr/app/id6789540285',
      web: 'https://ai-music-studio.com/',
      androidPending: true,
      webIsLegal: true,
    },
    theme: {
      surface: '#1d2022',
      ink: '#e0e3e5',
      inkSoft: '#cfc2d6',
      primary: '#b76dff',
      accent: '#ffc640',
      gradient: 'linear-gradient(135deg, #490080 0%, #2c0051 55%, #101415 100%)',
      font: "'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'music_note', title: '원하는 곡 입력', desc: '만들고 싶은 곡의 내용을 적으면 AI가 그 이야기를 노래로 담아냅니다.' },
      { icon: 'mic', title: '보이스 선택', desc: '원하는 가수 보이스 유형을 골라 곡의 분위기를 나에게 맞춰요.' },
      { icon: 'library_music', title: '소장과 공유', desc: '완성된 곡을 소장하고 공유하세요. 공유곡 재생은 앱을 통해 즐길 수 있어요.' },
    ],
    promo: {
      kicker: 'AI 음악 생성 스튜디오',
      headline: '떠오른 가사 한 줄이\n',
      headlineAccent: '한 곡이 되는 순간',
      subcopy:
        '원하는 곡의 내용을 적고 보이스를 고르면, AI가 그 이야기를 노래로 만들어 줍니다. 나만의 곡을 완성하고 소장·공유해 보세요.',
      // AI Music Studio: 다크 럭셔리 뮤직 테마 — 딥 퍼플 #490080 → 베이스 #101415, 라일락 primary + 골드 accent.
      dark: true,
      palette: {
        bg: '#101415',
        heroGradient:
          'linear-gradient(135deg, #490080 0%, #2c0051 55%, #101415 100%)',
        surface: '#1d2022',
        primary: '#ddb7ff',
        accent: '#ffc640',
        ink: '#e0e3e5',
        inkSoft: '#cfc2d6',
        onPrimary: '#2c0051',
      },
      fontDisplay: "'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif",
      fontBody: "'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif",
      radius: 22,
      motif: 'none',
      // 실제 앱 welcome 히어로(로고 중앙) 배경 + 실제 앱 홈(입력→보이스→생성) 스크린샷.
      heroImage: aimusicHero,
      heroFocus: 'center 30%',
      shot: aimusicShot,
      highlights: [
        { value: '8가지', label: '음악 장르' },
        { value: '30·60·180초', label: '곡 길이 선택' },
        { value: '3단계', label: '입력·보이스·생성' },
      ],
      // 좌측 내러티브: 실제 앱 3단계 흐름(입력 → 보이스 → 생성). 우측 비주얼은 shot(폰 목업)이 우선.
      steps: [
        {
          no: '1',
          title: '원하는 곡 입력',
          desc: '만들고 싶은 곡의 내용을 자유롭게 적어 주세요. 짧은 한 줄이면 충분해요.',
        },
        {
          no: '2',
          title: '보이스 선택',
          desc: '곡을 불러 줄 가수 보이스 유형을 골라 나만의 색을 입혀요.',
        },
        {
          no: '3',
          title: 'AI가 생성',
          desc: 'AI가 입력한 내용을 노래로 완성해 줘요. 마음에 들면 바로 소장·공유하세요.',
        },
      ],
      disclaimer:
        '생성 결과물은 AI가 만든 음악으로, 입력 내용과 선택한 옵션에 따라 결과가 달라질 수 있습니다. 실제 아티스트·기존 곡과의 유사성을 보장하거나 의도하지 않으며, 저작권 및 이용 범위는 앱 내 안내를 따릅니다. 공유된 곡의 재생은 앱을 통해서만 가능합니다.',
    },
    order: 5,
  },
  {
    id: 'lawpic',
    name: '로픽',
    tagline: '계약서, 사진 한 장이면 됩니다',
    description:
      '계약서·협약서를 사진으로 찍으면 로픽 AI가 어려운 법률 내용을 쉽게 풀어주고, 놓치기 쉬운 조항과 꼭 확인해야 할 부분을 짚어드립니다. 궁금한 점은 AI 법률 챗봇에게 바로 물어보세요.',
    // iOS 출시 완료(Apple ID 6792434731, 개발자 HOONJAE PARK). Android는 준비 중(스토어 미출시)
    // → androidPending으로 "준비 중" 배지 표기. Android 출시 시 androidPending 제거하고
    // android 링크만 추가하면 자동 반영.
    // web은 라이브 홍보 랜딩(lawpic-promo.vercel.app)이지만 iOS 출시로 앱 설치 유도가
    // 우선이라 App Store를 primary로(webIsLegal). PLATFORM_COUNT(Hero)·PLATFORMS(Technology)에
    // iOS는 다른 앱으로 이미 집계돼 총 플랫폼 수 불변, androidPending은 미집계 → 허위 출시 방지.
    status: 'live',
    moodLabel: 'Ethereal Sky Trust',
    emoji: '⚖️',
    iconUrl: lawpicIcon,
    links: {
      ios: 'https://apps.apple.com/kr/app/id6792434731',
      web: 'https://lawpic-promo.vercel.app/',
      androidPending: true,
      webIsLegal: true,
    },
    theme: {
      surface: '#ffffff',
      ink: '#0f172a',
      inkSoft: '#475569',
      // 스카이 블루 #0284c7(sky-600): 흰 글씨 대비 4.55:1 WCAG AA 충족.
      // 밝은 원색 #38bdf8은 대비 미달이라 accent(틴트/포인트)로만 사용.
      primary: '#0284c7',
      accent: '#38bdf8',
      gradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 55%, #f8fafc 100%)',
      font: "'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
      onPrimary: '#ffffff',
    },
    features: [
      { icon: 'photo_camera', title: '사진으로 계약서 분석', desc: '계약서·협약서를 찍으면 AI가 쉬운 말로 풀어 설명' },
      { icon: 'gavel', title: '핵심 조항 체크', desc: '놓치기 쉬운 조항과 꼭 확인할 부분을 짚어줌' },
      { icon: 'forum', title: 'AI 법률 챗봇', desc: '궁금한 법률 질문을 실시간으로 물어보기' },
    ],
    promo: {
      kicker: 'AI 법률 도우미',
      headline: '어려운 계약서,\n',
      headlineAccent: '사진 한 장이면 됩니다',
      subcopy:
        '계약서·협약서를 사진으로 찍기만 하면, 로픽 AI가 어려운 법률 내용을 쉽게 풀어주고 놓치기 쉬운 조항을 짚어드려요. 궁금한 점은 AI 법률 챗봇에게 바로 물어보세요.',
      // 로픽 web: ethereal 스카이 블루(글래스모피즘) 라이트 럭셔리 — 신뢰감 있는 법률 무드. dark 미설정.
      palette: {
        bg: '#f0f9ff',
        heroGradient:
          'linear-gradient(150deg, #7dd3fc 0%, #38bdf8 45%, #0284c7 100%)',
        surface: '#ffffff',
        primary: '#0284c7',
        accent: '#38bdf8',
        ink: '#0f172a',
        inkSoft: '#475569',
        onPrimary: '#ffffff',
      },
      fontDisplay: "'Jua', 'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
      fontBody: "'Quicksand', 'Noto Sans KR', system-ui, sans-serif",
      radius: 28,
      motif: 'none',
      // 실제 홍보 랜딩의 부엉이 마스코트(투명 배경) — 분석 결과 카드 상단 배지.
      mascot: lawpicMascot,
      // 홍보 사이트 최신 시그니처 비주얼: 글래스 "분석 결과" 카드(안심도 + 주의/안전 조항).
      // 멀티 액센트(초록=안전/노랑=주의)로 "AI가 위험·안전 조항을 구분" 서사를 재현.
      accentSafe: '#10b981', // 사이트 --color-green (안전 조항)
      accentCaution: '#eab308', // 사이트 --color-amber (주의 조항)
      trialBadge: '3일 무료체험',
      analysisCard: {
        docLabel: '근로계약서.pdf · 3장 · 조항 12개 검토 완료',
        safetyScore: 78,
        // 홍보 사이트와 동일: 스캔 결과를 "위험 1 · 안전 6"으로 한눈에 요약.
        tally: { risk: 1, safe: 6 },
        clauses: [
          {
            kind: 'caution',
            tag: '제8조 · 경업 금지',
            text: '퇴사 후 24개월 — 통상 기준(12개월)보다 길어요.',
            emphasis: '24개월',
            // 부엉이가 풀어주는 쉬운 해설 — "AI가 어려운 말을 쉽게 풀어준다"는 핵심 가치의 시각화.
            ownerNote: '쉽게 말하면, 2년간 같은 업종 이직이 제한될 수 있다는 뜻이에요. 조정을 요청해보는 걸 추천해요!',
          },
          {
            kind: 'safe',
            tag: '제5조 · 급여 지급',
            text: '급여·수습 조건이 표준 범위 안에 있고, 지급일과 산정 방식도 명확해요.',
          },
        ],
      },
      highlights: [
        { value: '사진 한 장', label: '계약서 분석' },
        { value: '여러 장', label: '한 번에 분석' },
        { value: '3일', label: '무료체험' },
      ],
      // 우측 비주얼: 실제 서비스 흐름 3단계 (촬영 → AI 분석 → 궁금증 해결).
      steps: [
        {
          no: '1',
          title: '계약서 촬영',
          desc: '계약서나 협약서를 사진으로 찍어 올려주세요. 여러 장도 한 번에 가능해요.',
        },
        {
          no: '2',
          title: 'AI 분석',
          desc: '로픽 AI가 어려운 법률 내용을 쉬운 말로 풀어주고, 꼭 확인할 조항을 짚어줘요.',
        },
        {
          no: '3',
          title: '궁금증 해결',
          desc: '추가로 궁금한 점은 AI 법률 챗봇에게 실시간으로 물어보세요.',
        },
      ],
      disclaimer:
        '로픽의 AI 설명·분석은 일반적인 정보 제공과 참고를 위한 것으로, 변호사의 법률 자문이나 법률 판단을 대체하지 않습니다. 중요한 법적 결정은 반드시 전문가와 상담하세요.',
    },
    order: 6,
  },
];

export const SERVICES_SORTED = [...SERVICES].sort((a, b) => a.order - b.order);
