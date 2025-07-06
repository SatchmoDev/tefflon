"use client"

import { useFormStatus } from "react-dom"

type Props = { 
  text?: string
  variant?: "primary" | "secondary" | "success" | "danger"
  fullWidth?: boolean
}

export default function Pending({ 
  text = "Submit", 
  variant = "primary",
  fullWidth = false 
}: Props) {
  const { pending } = useFormStatus()
  
  const getButtonClass = () => {
    const baseClass = `btn-${variant}`
    const disabledClass = pending 
      ? "opacity-50 cursor-not-allowed" 
      : ""
    const widthClass = fullWidth ? "w-full" : "min-w-[120px]"
    
    return `${baseClass} ${disabledClass} ${widthClass} relative`
  }

  return (
    <button 
      type="submit"
      disabled={pending}
      className={getButtonClass()}
    >
      {pending && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg 
            className="animate-spin h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span className={pending ? "ml-6" : ""}>
        {pending ? "Processing..." : text}
      </span>
    </button>
  )
}
