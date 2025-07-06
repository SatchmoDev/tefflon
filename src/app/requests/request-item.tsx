"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

interface RequestItemProps {
  request: {
    id: string
    destination: string
    created: number
  }
  status: "pending" | "approved" | "denied"
}

export default function RequestItem({ request, status }: RequestItemProps) {
  const router = useRouter()
  const date = new Date(request.created).toLocaleDateString()

  return (
    <Link
      href={`/requests/${request.id}`}
      className="block hover:no-underline"
    >
      <div className="card transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {request.destination}
            </h3>
            <p className="mb-0 text-sm text-slate-600">
              Submitted on {date}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span
                className={
                  status === "approved"
                    ? "status-approved"
                    : status === "denied"
                      ? "status-denied"
                      : "status-pending"
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {status === "denied" && (
                <button
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/requests/${request.id}/edit`)
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}