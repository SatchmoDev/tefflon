import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { getLatestReview, getReviewHistory } from "@/utils/reviews"
import { doc, getDoc } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import EditForm from "./edit-form"

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

  return { title: `Edit: ${destination}` }
}

export default async function EditRequest({ params }: Props) {
  const user = await identify()
  const request = await getRequest(params)
  const requestData = request.data()

  // Verify user owns this request
  if (requestData.uid !== user.uid) notFound()

  // Get review information to check if editing is allowed
  const latestReview = await getLatestReview(request.id)
  const reviewHistory = await getReviewHistory(request.id)
  const status = latestReview?.status || "pending"

  // Only allow editing for pending or denied requests
  if (status === "approved") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="alert alert-warning">
          <h3 className="font-medium text-yellow-800 mb-2">
            Cannot Edit Approved Request
          </h3>
          <p className="text-sm text-yellow-700">
            This request has been approved and cannot be edited. Contact an administrator if changes are needed.
          </p>
          <Link href={`/requests/${request.id}`} className="btn-secondary mt-4 inline-block">
            Back to Request
          </Link>
        </div>
      </div>
    )
  }

  const { name, phone, destination, start, end, created, modified } = requestData
  const submitDate = new Date(created).toLocaleDateString()
  const lastModified = modified ? new Date(modified).toLocaleDateString() : null

  // Extract form data for EditForm component
  const formData = { name, phone, destination, start, end }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
          <Link href="/requests" className="hover:text-slate-900">
            Requests
          </Link>
          <span>/</span>
          <Link href={`/requests/${request.id}`} className="hover:text-slate-900">
            {destination}
          </Link>
          <span>/</span>
          <span className="text-slate-900">Edit</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Request
          </h1>
          <span className={`status-${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="text-sm text-slate-600 mt-2">
          <p>Originally submitted on {submitDate}</p>
          {lastModified && <p>Last modified on {lastModified}</p>}
        </div>
      </div>

      {/* Show review history as context */}
      {reviewHistory.length > 0 && (
        <div className="card mb-8 bg-yellow-50 border-yellow-200">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900">
              Previous Review Feedback
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Please review the feedback below and make necessary changes to your request.
            </p>
          </div>
          <div className="space-y-4">
            {reviewHistory.map((review) => (
              <div key={review.id} className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`status-${review.status}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                  <p className="text-sm text-slate-600">
                    {new Date(review.created).toLocaleDateString()}
                  </p>
                </div>
                {review.message && (
                  <div className="bg-white p-3 rounded border">
                    <p className="text-slate-900 text-sm">{review.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit form */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900">
            Update Request Details
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Make your changes below. This will reset the request status to pending for review.
          </p>
        </div>
        <EditForm requestId={request.id} initialData={formData} />
      </div>
    </div>
  )
}