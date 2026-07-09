// 에이아이소프트 서비스 카탈로그.
// 신규 서비스는 이 배열에 항목만 추가하면 쇼케이스/Features 등에 자동 반영된다.
// (CLAUDE.md: "신규 서비스가 추가될 수 있는 형태로 개발")

// 실제 앱 아이콘(각 서비스 빌드 자산에서 추출, 256px 최적화).
import mytravelIcon from '../assets/services/mytravel-icon.png';
import mypetIcon from '../assets/services/mypet-icon.png';
import mybabyIcon from '../assets/services/mybaby-icon.png';
import mytodayIcon from '../assets/services/mytoday-icon.png';

// 각 서비스 홈페이지의 실제 실사 이미지(원본 프로젝트에서 추출).
// myPet: 실사 히어로(강아지) + 실제 앱 홈 스크린샷.
// myTravel: 실사를 원격 Unsplash URL로 로드 — 원본 앱과 동일 여행지 사진.
// myBaby: 실제 랜딩 히어로(K-pop 스타 4인 실사, hero-kpop4) 배경 — 다크 스크림으로 가독성 확보.
import mypetHero from '../assets/promo/mypet/hero-puppy.webp';
import mypetShot from '../assets/promo/mypet/shot-home.webp';
import mybabyHero from '../assets/promo/mybaby/hero-stars.webp';
// myToday: 새싹 마스코트(투명 배경) — 우측 히어로 일러스트.
import mytodayMascot from '../assets/promo/mytoday/mascot.webp';

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
        '목적지와 날짜만 입력하세요. AI가 명소·맛집·날씨·이동 동선까지 꼼꼼하게 계획합니다. 17개 언어 지원.',
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
      // myPet web 홈의 실사 강아지 히어로 + 실제 앱 홈 화면 스크린샷
      heroImage: mypetHero,
      heroFocus: 'center 35%',
      shot: mypetShot,
      disclaimer:
        'AI 건강·법률 상담은 일반 정보 제공과 참고용이며, 수의학적 진단이나 법률 자문을 대체하지 않습니다. 시설 정보는 변동될 수 있습니다.',
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
        'K-pop·할리우드·라틴·유럽·스포츠까지, 전 세계 37개국 10,000명+ 셀럽의 공개 소식을 AI가 핵심만 골라 매일 요약해 드립니다.',
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
        '공개된 뉴스·언론 기사를 AI가 정리해 보여주는 서비스로, 소속사·아티스트의 공식 정보가 아닙니다. 표시된 이름·소속은 각 권리자에게 귀속됩니다.',
    },
    order: 3,
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
    // iOS 출시 완료(Apple ID 6785864596). Android 출시 시 android 링크만 추가하면 자동 반영.
    // web은 별도 홍보 사이트(my-today.net)지만 앱 설치 유도가 우선이라 App Store를 primary로.
    links: {
      ios: 'https://apps.apple.com/kr/app/id6785864596',
      web: 'https://my-today.net/',
      webIsLegal: true,
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
      subcopy:
        '매일의 기분을 기록하고 하고 싶은 일을 새싹처럼 키워보세요. 작은 습관이 모여 한 뼘씩 자라나는 나를 만나는 마음 습관 다이어리.',
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
];

export const SERVICES_SORTED = [...SERVICES].sort((a, b) => a.order - b.order);
