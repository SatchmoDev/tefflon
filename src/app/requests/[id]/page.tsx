import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { getLatestReview, getReviewHistory } from "@/utils/reviews"
import { doc, getDoc } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

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

  return { title: destination }
}

export default async function Request({ params }: Props) {
  const user = await identify()

  const request = await getRequest(params)
  const { uid, name, phone, destination, start, end, created } = request.data()

  if (user.uid !== uid) notFound()

  // Get review information
  const latestReview = await getLatestReview(request.id)
  const reviewHistory = await getReviewHistory(request.id)
  const status = latestReview?.status || "pending"

  const submitDate = new Date(created).toLocaleDateString()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/requests" className="hover:text-slate-900">
            Requests
          </Link>
          <span>/</span>
          <span className="text-slate-900">Request Details</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Request Details
          </h1>
          <span className={`status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-slate-800">
            {destination}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Submitted on {submitDate}
          </p>
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

      {/* Show review status and admin message if reviewed */}
      {latestReview ? (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">
              Review Status
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`status-${latestReview.status}`}>
                {latestReview.status.charAt(0).toUpperCase() + latestReview.status.slice(1)}
              </span>
              <p className="text-sm text-slate-600">
                Reviewed on {new Date(latestReview.created).toLocaleDateString()}
              </p>
            </div>

            {latestReview.message && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">
                  {latestReview.status === "approved" ? "Approval Notes" : "Reason for Denial"}
                </h4>
                <div className={`p-4 rounded-md ${
                  latestReview.status === "approved" 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <p className={
                    latestReview.status === "approved" 
                      ? "text-green-900" 
                      : "text-red-900"
                  }>
                    {latestReview.message}
                  </p>
                </div>
              </div>
            )}

            {latestReview.status === "denied" && (
              <div className="alert alert-info">
                <h4 className="font-medium text-blue-800 mb-2">
                  Request Denied - Action Required
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  Please review the feedback above and edit your request to address the concerns mentioned.
                </p>
                <div className="flex space-x-3">
                  <Link href={`/requests/${request.id}/edit`} className="btn-primary">
                    Edit This Request
                  </Link>
                  <Link href="/requests/new" className="btn-secondary">
                    Submit New Request
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card mb-8 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Pending Review
          </h3>
          <p className="text-slate-600">
            Your request is currently pending review. You will receive notification once a decision has been made.
          </p>
        </div>
      )}

      {/* Show review history if there are multiple reviews */}
      {reviewHistory.length > 1 && (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">
              Previous Reviews ({reviewHistory.length - 1} review{reviewHistory.length > 2 ? 's' : ''})
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              History of previous feedback on this request
            </p>
          </div>
          <div className="space-y-4">
            {reviewHistory.slice(1).map((review) => (
              <div 
                key={review.id} 
                className="p-4 rounded-md border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`status-${review.status}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                  <p className="text-sm text-slate-600">
                    {new Date(review.created).toLocaleDateString()}
                  </p>
                </div>
                
                {review.message && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      {review.status === "approved" ? "Approval Notes" : "Reason for Denial"}
                    </h4>
                    <div className={`p-3 rounded border ${
                      review.status === "approved" 
                        ? "bg-green-50 border-green-200 text-green-900" 
                        : "bg-red-50 border-red-200 text-red-900"
                    }`}>
                      <p className="text-sm">{review.message}</p>
                    </div>
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

      <div className="flex justify-between">
        <Link href="/requests" className="btn-secondary">
          Back to Requests
        </Link>
        
        {/* Show edit button for pending or denied requests */}
        {(status === "pending" || status === "denied") && (
          <Link href={`/requests/${request.id}/edit`} className="btn-primary">
            Edit Request
          </Link>
        )}
      </div>
    </div>
  )
}
