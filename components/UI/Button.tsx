import Link from "next/link"
import clsx from "clsx"

export default function Button({
  href,
  children,
  className = "",
  fullWidth = false,
}: {
  href: string
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-all",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </Link>
  )
}
