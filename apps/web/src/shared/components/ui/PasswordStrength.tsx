type Props = {
  level: 'LOW' | 'MEDIUM' | 'STRONG'
}

const levels = {
  LOW: 1,
  MEDIUM: 2,
  STRONG: 4
}

export function PasswordStrength({ level }: Props) {
  const active = levels[level]

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded ${
              i < active ? 'bg-[#2FA4A9]' : 'bg-[#2FA4A9]'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#2FA4A9] font-medium">
        {level}
      </span>
    </div>
  )
}
