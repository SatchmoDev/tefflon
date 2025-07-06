import { db } from "@/lib/firebase"
import { identify } from "@/utils/server"
import { getRequestsWithStatus } from "@/utils/reviews"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Metadata } from "next"
import Link from "next/link"
import RequestItem from "./request-item"

export const metadata: Metadata = { title: "Requests" }

export default async function Requests() {
  const { uid } = await identify()

  // Get user's requests
  const { docs } = await getDocs(
    query(collection(db, "requests"), where("uid", "==", uid)),
  )

  // Get status for all requests from reviews collection
  const requestIds = docs.map((doc) => doc.id)
  const statusMap = await getRequestsWithStatus(requestIds)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Your Requests</h1>
        <Link href="/requests/new" className="btn-primary">
          New Request
        </Link>
      </div>

      {docs.length === 0 ? (
        <div className="py-12 text-center">
          <div className="card bg-slate-50">
            <h2 className="mb-4 text-xl font-semibold text-slate-600">
              No requests yet
            </h2>
            <p className="mb-6 text-slate-500">
              You haven't submitted any requests. Get started by creating your
              first request.
            </p>
            <Link href="/requests/new" className="btn-primary">
              Create Your First Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {docs.map((request) => {
            const { destination, created } = request.data()
            const status = statusMap.get(request.id) || "pending"

            return (
              <RequestItem
                key={request.id}
                request={{
                  id: request.id,
                  destination,
                  created
                }}
                status={status}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
