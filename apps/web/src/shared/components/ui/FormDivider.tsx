type Props = {
  label: string
}

export function FormDivider({ label }: Props) {
  return (
    <div className="flex items-center gap-4 my-6">
      <span className="h-px flex-1 bg-[#2FA4A9]" />
      <span className="text-xs text-[#2FA4A9] font-medium">
        {label}
      </span>
      <span className="h-px flex-1 bg-[#2FA4A9]" />
    </div>
  )
}
