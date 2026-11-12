type IconProps = { className?: string }

function IconBase({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return <IconBase {...props}><path d="M4 12 12 4M6 4h6v6" /></IconBase>
}

export function ArrowRightIcon(props: IconProps) {
  return <IconBase {...props}><path d="M3 8h10M9 4l4 4-4 4" /></IconBase>
}

export function ArrowLeftIcon(props: IconProps) {
  return <IconBase {...props}><path d="M13 8H3M7 4 3 8l4 4" /></IconBase>
}

export function ChevronIcon({ direction, ...props }: IconProps & { direction: 'left' | 'right' }) {
  return (
    <IconBase {...props}>
      <path d={direction === 'left' ? 'm10 3-5 5 5 5' : 'm6 3 5 5-5 5'} />
    </IconBase>
  )
}

export function PlayIcon(props: IconProps) {
  return <IconBase {...props}><path fill="currentColor" stroke="none" d="m5 3 8 5-8 5Z" /></IconBase>
}

export function PauseIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5.5 3.5v9M10.5 3.5v9" /></IconBase>
}
