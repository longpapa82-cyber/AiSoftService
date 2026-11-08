import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  RefObject,
} from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';

type CommonProps = {
  variant?: ButtonVariant;
  /** 좌측 아이콘/이모지 슬롯 */
  icon?: ReactNode;
  /** 다크 무대(딥 네이비 히어로 등) 위 배치 — primary는 골드 일렉트릭으로 반전 */
  onDark?: boolean;
  /** 포인터 접근 시 커서 방향으로 살짝 끌리는 자석 효과(마우스 전용·opt-in) */
  magnetic?: boolean;
  children: ReactNode;
};

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    href?: undefined;
  };

export type ButtonProps = AnchorProps | NativeButtonProps;

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * 공통 버튼. href가 있으면 <a>, 없으면 <button>으로 렌더.
 * 외부 링크(http/https)는 자동으로 target/rel을 안전하게 설정한다.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    icon,
    onDark,
    magnetic,
    children,
    className,
    ...rest
  } = props;

  // 자석 효과는 opt-in. 훅은 항상 호출(규칙 준수)하되 ref 부착 여부로 활성화.
  const magRef = useMagnetic<HTMLElement>(6);

  const classNames = [
    styles.base,
    styles[variant],
    onDark ? styles.onDark : '',
    magnetic ? styles.magnetic : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (typeof props.href === 'string') {
    const { href, target, rel, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = isExternal(props.href);
    return (
      <a
        {...anchorRest}
        ref={magnetic ? (magRef as RefObject<HTMLAnchorElement>) : undefined}
        href={props.href}
        className={classNames}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
      >
        {content}
      </a>
    );
  }

  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonRest}
      ref={magnetic ? (magRef as RefObject<HTMLButtonElement>) : undefined}
      type={type ?? 'button'}
      className={classNames}
    >
      {content}
    </button>
  );
}
