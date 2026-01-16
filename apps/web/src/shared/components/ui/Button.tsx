import { ButtonHTMLAttributes } from 'react'
import { Link, type To } from 'react-router-dom'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'ghost'

type BaseProps = {
  variant?: Variant
  isLoading?: boolean
  className?: string
  children: React.ReactNode
}

/* ---------- BUTTON PROPS ---------- */
type NativeButtonProps =
  BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

/* ---------- LINK PROPS ---------- */
type LinkButtonProps =
  BaseProps & { to: To }

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
    children
  } = props

  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:opacity-60'

  const variants: Record<Variant, string> = {
    primary:
      'h-12 w-full px-6 bg-[#2FA4A9] text-white hover:bg-[#4BCAD1]',
    ghost:
      'h-10 px-5 text-[#2FA4A9] hover:text-[#4BCAD1] hover:underline'
  }

  const classes = cn(baseClasses, variants[variant], className)

  /* ---------- LINK ---------- */
  if ('to' in props) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  /* ---------- BUTTON ---------- */
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={classes}
    >
      {isLoading && (
        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
