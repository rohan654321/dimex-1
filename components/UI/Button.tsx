import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  href?: string
  onClick?: () => void
  className?: string
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  fullWidth = false
}: ButtonProps) {
  const baseClasses = 'flex-center gap-2 overflow-hidden rounded-full font-semibold global-transition px-5 py-3'
  const variantClasses = {
    primary: 'bg-[var(--main-color-2)] text-white hover:bg-[var(--main-color-4)]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-[var(--main-color-2)] text-[var(--main-color-2)] hover:bg-[var(--main-color-2)] hover:text-white'
  }
  const widthClass = fullWidth ? 'w-full' : 'w-fit'
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  )
}