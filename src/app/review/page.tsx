import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { getLatestReview, getRequestEditInfo } from "@/utils/reviews"
import { collection, getDocs, query } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Review" }

export default async function Review() {
  await identify(true)

  // Get all requests
  const allRequestsQuery = query(collection(db, "requests"))
  const { docs: allRequests } = await getDocs(allRequestsQuery)

  // Filter requests that need review
  const requestsNeedingReview = []
  
  for (const request of allRequests) {
    const requestData = request.data()
    const latestReview = await getLatestReview(request.id)
    
    // Include if no review exists (truly pending)
    if (!latestReview) {
      requestsNeedingReview.push({
        request,
        reviewStatus: "pending",
        isReReview: false
      })
      continue
    }
    
    // Include if denied and modified since last review
    if (latestReview.status === "denied") {
      const editInfo = getRequestEditInfo(requestData)
      if (editInfo.isModified && editInfo.modified && editInfo.modified.getTime() > latestReview.created) {
        requestsNeedingReview.push({
          request,
          reviewStatus: "re-review",
          isReReview: true
        })
      }
    }
    
    // Exclude approved requests and unmodified denied requests
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Review Requests
        </h1>
        <p className="text-slate-600">
          Review and approve or deny pending requests ({requestsNeedingReview.length}{" "}
          {requestsNeedingReview.length === 1 ? "request" : "requests"} awaiting review)
        </p>
      </div>

      {requestsNeedingReview.length === 0 ? (
        <div className="py-12 text-center">
          <div className="card bg-slate-50">
            <h2 className="mb-4 text-xl font-semibold text-slate-600">
              No pending requests
            </h2>
            <p className="text-slate-500">
              There are no requests pending review at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requestsNeedingReview.map((requestItem) => {
            const { destination, name, created, modified } = requestItem.request.data()
            const date = new Date(created).toLocaleDateString()
            const modifiedDate = modified ? new Date(modified).toLocaleDateString() : null

            return (
              <Link
                href={`/review/${requestItem.request.id}`}
                key={requestItem.request.id}
                className="block hover:no-underline"
              >
                <div className="card transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {destination}
                        </h3>
                        {requestItem.isReReview && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                            Re-Review
                          </span>
                        )}
                      </div>
                      <p className="mb-1 text-sm text-slate-600">
                        Requested by: {name}
                      </p>
                      <p className="mb-0 text-sm text-slate-500">
                        Submitted on {date}
                        {modifiedDate && (
                          <span className="text-blue-600 font-medium ml-2">
                            • Modified on {modifiedDate}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={requestItem.isReReview ? "status-pending" : "status-pending"}>
                        {requestItem.isReReview ? "Pending Re-Review" : "Pending Review"}
                      </span>
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
          })}
        </div>
      )}
    </div>
  )
}
