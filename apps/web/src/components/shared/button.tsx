import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link' 
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'ghost' | 'outline'

type BaseProps = {
  variant?: Variant
  isLoading?: boolean
  className?: string
  children: React.ReactNode
}

/* ---------- BUTTON PROPS ---------- */
type NativeButtonProps = BaseProps & 
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }

/* ---------- LINK PROPS ---------- */
// En Next.js usamos 'href' en lugar de 'to'
type LinkButtonProps = BaseProps & 
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/* ---------- OVERLOADS ---------- */
export function Button(props: NativeButtonProps): JSX.Element
export function Button(props: LinkButtonProps): JSX.Element

/* ---------- IMPLEMENTATION ---------- */
export function Button(
  props: NativeButtonProps | LinkButtonProps
) {
  const {
    variant = 'primary',
    isLoading,
    className,
    children,
    ...rest
  } = props

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:opacity-60'

  const variants: Record<Variant, string> = {
    primary:
      'h-12 w-full px-6 bg-[#FF7A1A] text-white hover:bg-[#FF7A1A]/80',
    ghost:
      'h-10 px-5 text-[#FF7A1A] hover:text-[#FF7A1A]/80 hover:underline',
    outline:
      'h-12 w-full px-6 border border-[#FF7A1A] text-[#FF7A1A] hover:bg-[#FF7A1A]/80 hover:text-white hover:border-[#FF7A1A]'
  }
  
  const classes = cn(baseClasses, variants[variant], className)

  /* ---------- LINK (Next.js) ---------- */
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as LinkButtonProps
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  /* ---------- BUTTON ---------- */
  const { disabled, ...buttonProps } = rest as NativeButtonProps
  return (
    <button
      {...buttonProps}
      disabled={isLoading || disabled}
      className={classes}
    >
      {isLoading ? (
        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
export default Button;