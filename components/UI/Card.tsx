import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`group flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-5 xl:p-7 ${className}`}>
      {children}
    </div>
  )
}