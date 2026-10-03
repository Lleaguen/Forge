export default function Footer() {
  return (
    <footer className="
      flex-shrink-0 py-3 px-10
      border-t border-brand-light-border bg-brand-light-surface
      text-center text-xs text-brand-light-muted
      dark:border-white/5 dark:bg-transparent dark:text-brand-Muted
    ">
      © 2026 Forge •{' '}
      <span className="text-brand-light-accent dark:text-brand-primary font-medium">
        v1.0.0
      </span>
    </footer>
  )
}
