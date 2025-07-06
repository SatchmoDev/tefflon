import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { getLatestReview, getReviewHistory, getRequestEditInfo } from "@/utils/reviews"
import { doc, getDoc } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReviewForm from "./review-form"

type Props = { params: Promise<{ id: string }> }

const getRequest = async (params: Props["params"]) => {
  const { id } = await params
  const request = await getDoc(doc(db, "requests", id))

  if (!request.exists()) notFound()
  return request
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const request = await getRequest(params)
  const { destination } = request.data()

  return { title: `Review: ${destination}` }
}

export default async function Request({ params }: Props) {
  await identify(true)

  const request = await getRequest(params)
  const requestData = request.data()
  const { name, phone, destination, start, end } = requestData
  
  // Get review information
  const latestReview = await getLatestReview(request.id)
  const reviewHistory = await getReviewHistory(request.id)
  const status = latestReview?.status || "pending"

  // Get edit information
  const editInfo = getRequestEditInfo(requestData)
  const submitDate = editInfo.created.toLocaleDateString()

  // Determine if this request needs review
  const needsReview = !latestReview || 
    (latestReview.status === "denied" && 
     editInfo.isModified && 
     editInfo.modified && 
     editInfo.modified.getTime() > latestReview.created)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/review" className="hover:text-slate-900">
            Review
          </Link>
          <span>/</span>
          <span className="text-slate-900">Request Review</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Review Request
          </h1>
          <span className={`status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      <div className="card mb-8">
        <div className="card-header">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {destination}
              </h2>
              <div className="text-slate-600 text-sm mt-1">
                <p>Originally submitted on {submitDate}</p>
                {editInfo.isModified && (
                  <p className="text-blue-600 font-medium">
                    Last edited on {editInfo.lastModifiedDate} (Version {editInfo.version})
                  </p>
                )}
              </div>
            </div>
            {editInfo.isModified && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Edited
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Full Name
              </h3>
              <p className="text-slate-900">{name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </h3>
              <p className="text-slate-900">{phone}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Destination
            </h3>
            <p className="text-slate-900">{destination}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                Start Date
              </h3>
              <p className="text-slate-900">{start}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">
                End Date
              </h3>
              <p className="text-slate-900">{end}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Show existing review if one exists */}
      {latestReview && (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">
              Review Decision
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`status-${latestReview.status}`}>
                {latestReview.status.charAt(0).toUpperCase() + latestReview.status.slice(1)}
              </span>
              <div className="text-sm text-slate-600">
                <p>Reviewed by: {latestReview.email}</p>
                <p>Date: {new Date(latestReview.created).toLocaleDateString()}</p>
              </div>
            </div>
            {latestReview.message && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Admin Message
                </h4>
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-slate-900">{latestReview.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review form for requests that need review */}
      {needsReview && (
        <div className="card mb-8">
          {latestReview?.status === "denied" && editInfo.isModified && (
            <div className="card-header">
              <div className="alert alert-info">
                <h4 className="font-medium text-blue-800 mb-2">
                  Re-Review Required
                </h4>
                <p className="text-sm text-blue-700">
                  This request was previously denied but has been modified by the user since then. 
                  Please review the updated information and make a new decision.
                </p>
              </div>
            </div>
          )}
          <ReviewForm requestId={request.id} />
        </div>
      )}

      <div className="flex justify-between">
        <Link href="/review" className="btn-secondary">
          Back to Review
        </Link>
        {!needsReview && latestReview && (
          <div className="alert alert-info">
            <p className="text-sm">
              This request has already been {status}.
              {status === "denied" && !editInfo.isModified && (
                <span className="block mt-1">
                  The user can edit this request to submit it for re-review.
                </span>
              )}
            </p>
          </div>
        )}
        
        {/* Review History for Admins */}
        {reviewHistory.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-slate-900">
                Review History ({reviewHistory.length} review{reviewHistory.length > 1 ? 's' : ''})
              </h3>
            </div>
            <div className="space-y-4">
              {reviewHistory.map((review, index) => (
                <div 
                  key={review.id} 
                  className={`p-4 rounded-md border ${
                    index === 0 ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`status-${review.status}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>{new Date(review.created).toLocaleDateString()} at {new Date(review.created).toLocaleTimeString()}</p>
                      <p>by {review.email}</p>
                    </div>
                  </div>
                  
                  {review.message && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Admin Message:
                      </h4>
                      <p className="text-slate-900 text-sm bg-white p-3 rounded border">
                        {review.message}
                      </p>
                    </div>
                  )}
                  
                  {!review.message && (
                    <p className="text-slate-500 text-sm italic">
                      No message provided with this review.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
