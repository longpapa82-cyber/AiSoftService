import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'outline';

type CommonProps = {
  variant?: ButtonVariant;
  /** 좌측 아이콘/이모지 슬롯 */
  icon?: ReactNode;
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
  const { variant = 'primary', icon, children, className, ...rest } = props;

  const classNames = [styles.base, styles[variant], className]
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
    <button {...buttonRest} type={type ?? 'button'} className={classNames}>
      {content}
    </button>
  );
}
